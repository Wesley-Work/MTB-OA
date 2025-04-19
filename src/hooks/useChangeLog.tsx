import { defineComponent, Fragment } from 'vue';
import { h } from 'vue';
import { Tag, Link, Timeline, TimelineItem } from 'tdesign-vue-next';

import { html } from '../../CHANGELOG.md';

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
      </Link>,
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < htmlString.length) {
    result.push(htmlString.slice(lastIndex));
  }
  return result;
};

const codeTagConvert = (htmlString: string, includeDate = false) => {
  const result = [];
  let lastIndex = 0;
  let match;
  while ((match = codeTag.exec(htmlString)) !== null) {
    const textBeforeCode = htmlString.slice(lastIndex, match.index);
    if (textBeforeCode) {
      result.push(aTagConvert(textBeforeCode));
    }
    const innerText = match[1];
    result.push(
      includeDate ? (
        <Tag size="large">{innerText.replace(/-/g, '/')}</Tag>
      ) : (
        <Tag size="small" theme="danger" variant="light">
          {innerText}
        </Tag>
      ),
    );
    lastIndex = codeTag.lastIndex;
  }
  if (lastIndex < htmlString.length) {
    result.push(aTagConvert(htmlString.slice(lastIndex)));
  }
  return result.length === 0 ? htmlString : result;
};

const parseListItem = (li: Element) => {
  let textContent = '';
  const children = [];

  li.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const trimmedText = node.textContent?.trim();
      if (trimmedText) {
        textContent += trimmedText;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName.toLowerCase() === 'ul') {
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
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const ulElement = doc.querySelector('ul');
  if (!ulElement) {
    return [];
  }
  return Array.from(ulElement.children).map(parseListItem);
};

const treeMarkdown = (str: string) => {
  const h2SpList = str
    .split(/<h2>/)
    .splice(1)
    .map((item) => {
      const [version, rest] = item.split(/<\/h2>/);
      const children = rest
        .split(/<h3>/)
        .splice(1)
        .map((item) => {
          const [type, content] = item.split(/<\/h3>/);
          return {
            type,
            children: ulTagConvert(content),
          };
        });
      return {
        version,
        children,
      };
    });
  return h2SpList;
};

const renderLogItem = (items, deep = 0) => {
  return items.map((vi, index) => {
    if (vi?.children) {
      return (
        <ul style={{ listStyleType: deep % 2 === 0 ? 'disc' : 'circle' }}>
          <li key={index}>
            {codeTagConvert(vi.text)}
            {renderLogItem(vi.children, deep + 1)}
          </li>
        </ul>
      );
    }
    return (
      <ul style={{ listStyleType: deep % 2 === 0 ? 'disc' : 'circle' }}>
        <li key={index}>{codeTagConvert(vi.text)}</li>
      </ul>
    );
  });
};

const renderLogTag = (items) => {
  return items.map((vi, index) => (
    <Fragment key={index}>
      <h3 id={vi.type.replace(/ /g, '-')} style="margin: 1em 0;">
        {vi.type}
      </h3>
      {renderLogItem(vi.children)}
    </Fragment>
  ));
};

const renderAll = () => {
  const log = treeMarkdown(html);
  return log.map((vi, index) => {
    const { version, children } = vi;
    return (
      <TimelineItem key={index} dot-color="primary" class="blueline">
        <h2>{codeTagConvert(version, true)}</h2>
        {renderLogTag(children)}
      </TimelineItem>
    );
  });
};

export default defineComponent({
  name: 'CHANGELOGTsx',
  setup(props) {
    return () => <Timeline mode="same">{renderAll()}</Timeline>;
  },
});
