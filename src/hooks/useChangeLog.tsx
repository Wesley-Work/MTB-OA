import { defineComponent, Fragment } from "vue";
import { h } from "vue";
import { Tag, Link, Timeline, TimelineItem } from "tdesign-vue-next";

import { html } from "../../CHANGELOG.md";

const h2Tag = /<h2>(.*?)<\/h2>/g;
const codeTag = /<code>(.*?)<\/code>/g;

const aTagConvert = (htmlString: string) => {
    const regex = /(<a\s+href=["'](.*?)["']>(.*?)<\/a>)/g;
    let match;
    const result = [];
    let lastIndex = 0;
    while ((match = regex.exec(htmlString)) !== null) {
        if (lastIndex < match.index) {
            result.push(htmlString.slice(lastIndex, match.index));
        }
        const href = match[2];
        const linkText = match[3];
        result.push(
            <Link key={result.length} href={href} target="_blank" theme="primary" underline>
                {linkText}
            </Link>
        );
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < htmlString.length) {
        result.push(htmlString.slice(lastIndex));
    }
    return result;
};

const codeTagConvert = (htmlString: string, includeDate: boolean = false) => {
    const result = [];
    let lastIndex = 0;
    let match;
    while ((match = codeTag.exec(htmlString)) !== null) {
        const textBeforeCode = htmlString.slice(lastIndex, match.index);
        if (textBeforeCode) {
            result.push(aTagConvert(textBeforeCode) ?? textBeforeCode);
        }
        const innerText = match[1];
        result.push(
            includeDate ? (
                <Tag size="large">{innerText.replace(/-/g,'/')}</Tag>
            ) : (
                <Tag size="small" theme="danger" variant="light">
                    {innerText}
                </Tag>
            )
        );
        lastIndex = codeTag.lastIndex;
    }
    if (lastIndex < htmlString.length) {
        result.push(aTagConvert(htmlString.slice(lastIndex)) ?? htmlString.slice(lastIndex));
    }
    return result.length === 0 ? htmlString : result;
};

// 正则获取字符串中的内容
const regExpGetContent = (REGEXP: RegExp, souceStr: string) => {
    return REGEXP.exec(souceStr);
};

const parseListItem = (li: Element) => {
    let textContent = "";
    const children = [];

    li.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const trimmedText = node.textContent?.trim();
            if (trimmedText) {
                textContent += trimmedText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.tagName.toLowerCase() === "ul") {
                children.push(...Array.from(element.children).map(parseListItem));
            } else {
                textContent += element.outerHTML;
            }
        }
    });

    return {
        text: textContent,
        ...(children.length > 0 ? { children } : {}),
    };
};

const ulTagConvert = (str: string) => {
    console.log(str);
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    const ulElement = doc.querySelector("ul");
    if (!ulElement) {
        return "No <ul> element found in the provided HTML string.";
    }
    return Array.from(ulElement.children).map((li) => parseListItem(li));
};

export default defineComponent({
    name: "CHANGELOGTsx",
    setup(props) {
        // 树形解析md
        const treeMarkdown = (str: string) => {
            // h2是版本+更新日期
            // h3是更新分类
            // 先以h2标签拆分
            console.log(regExpGetContent(h2Tag, str));
            const h2SpList = str
                .split(/<h2>/)
                .splice(1)
                .map((item) => {
                    let vi = item.split(/<\/h2>/);
                    return {
                        version: vi[0],
                        children: vi[1]
                            .split(/<h3>/)
                            .splice(1)
                            .map((item) => {
                                let vi = item.split(/<\/h3>/);
                                // ul比较特殊，要使用递归计算
                                return {
                                    type: vi[0],
                                    children: ulTagConvert(vi[1]),
                                };
                            }),
                    };
                });
            console.log(h2SpList);
            return h2SpList
        };


        const renderLogItem = (item,deep:number=0) => {
            console.log(item)
            return item.map(vi => {
                if (vi?.children) {
                    return (
                        <ul style={ deep % 2 === 0 ? "list-style-type: disc;" : "list-style-type: circle;" }>
                            <li>
                                {codeTagConvert(vi.text)}
                                {renderLogItem(vi.children,deep+1)}
                            </li>
                        </ul>
                    )
                }
                return (
                    <ul style={ deep % 2 === 0 ? "list-style-type: disc;" : "list-style-type: circle;" }>
                        <li>
                            {codeTagConvert(vi.text)}
                        </li>
                    </ul>
                )
            })
        };

        const renderLogTag = (item) => {
            return item.map(vi => {
                return (
                    <Fragment>
                        <h3 id={vi.type.replace(/ /g,'-')}>{vi.type}</h3>
                        {renderLogItem(vi.children)}
                    </Fragment>
                )
            })
        }

        const renderAll = () => {
            const log = treeMarkdown(html);
            const CHANGELOGEl = log.map(vi => {
                const { version, children } = vi
                console.log(children)
                return (
                    <TimelineItem dot-color="primary" class="blueline">
                        <h2>{codeTagConvert(version,true)}</h2>
                        { renderLogTag(children) }
                    </TimelineItem>
                )
            })
            return CHANGELOGEl;
        };

        return () => <Timeline mode="same">{renderAll()}</Timeline>;
    },
});
