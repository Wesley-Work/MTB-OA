<template>
    <div style="padding-top: 64px;display: flex;flex-direction: row;justify-content: space-evenly;">
        <div style="display: flex;flex-direction: column;align-items: center;">
        <span>3.X版本</span>
        <t-timeline mode="same">
            <!---->
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 3.0.3
                    <t-tag theme="success" variant="light" style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2024/05/08</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Dashboard</t-tag>: 上线部分内容(基础信息、借出/归还数据) @Wesley
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Theme-Toggle</t-tag>: 切换样式的动画 @Wesley
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">EquipmentLend</t-tag>、<t-tag size="small" theme="danger" variant="light">EquipmentReturn</t-tag>: 修复借出/归还后未清空输入框内容 @Wesley
                    </li>
                </ul>
            </t-timeline-item>
            <!---->
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 3.0.1
                    <t-tag theme="success" variant="light" style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2024/04/22</t-tag>
                </h2>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">API</t-tag>: 修复无法验证权限的Bug @Wesley
                    </li>
                </ul>
                <h3 id="❗-BREAKING-CHANGES">❗ BREAKING CHANGES</h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Return</t-tag>: 取消帮还选项，无需输入借出人Code @Wesley
                    </li>
                </ul>
            </t-timeline-item>
            <!---->
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 3.0.0 
                    <t-tag theme="success" variant="light" style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2024/04/16</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">...</t-tag>: 整体重构 @Wesley, @DDoS_LING
                    </li>
                </ul>
            </t-timeline-item>
            <!---->
        </t-timeline>
    </div>

    <div style="display: flex;flex-direction: column;align-items: center;">
        <span style="padding-right: 125px;">2.X版本(回退撤销)</span>
        <t-timeline mode="same" style="padding-left: 12px;">
            <t-timeline-item dot-color="success" class="greenline">
                <h2>🌈 2.2.3 <t-tag theme="success" variant="light"
                        style="color: #02d491;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Stable</t-tag>
                    <t-tag size="large">2023-07-01</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Login</t-tag>: 接入统一登录系统 @Wesley
                    </li>
                </ul>
                <h3 id="🚀-Update">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Function</t-tag>:
                        <ul>
                            <li>参数<t-tag size="small" theme="danger" variant="light">type</t-tag>不再有效 @Wesley</li>
                            <li><t-tag size="small" theme="danger" variant="light">Login</t-tag>返回增加验证 @Wesley</li>
                        </ul>
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">ALL</t-tag>: 全部请求不指定url，以当前地址为准 @Wesley
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="success" class="greenline">
                <h2>🌈 2.2.0 <t-tag theme="success" variant="light"
                        style="color: #02d491;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Stable</t-tag>
                    <t-tag size="large">2023-06-08</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Versioning</t-tag>: 版本管理暂时脱离Github平台
                    </li>
                </ul>
                <h3 id="🚀-Update">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">借出归还</t-tag>:
                        <ul>
                            <li>新增三项音频 @Wesley</li>
                        </ul>
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <li>数据库注入问题 @DDoS_LING</li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">借出归还</t-tag>:
                        <ul>
                            <li>音频同时播放 @Wesley</li>
                        </ul>
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 2.1.230515 <t-tag theme="success" variant="light"
                        style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2023-05-15</t-tag>
                </h2>
                <h3 id="🚀-Update">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Dashboard</t-tag>:
                        <ul>
                            <li>请求出错显示内容 @Wesley(<a
                                    href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/pull/50">#50</a>)
                            </li>
                        </ul>
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <!---->
                    <li>
                    <li>优化超时未退出登录 @Wesley(<a
                            href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/pull/50">#50</a>)
                    </li>
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 2.1.230322 <t-tag theme="success" variant="light"
                        style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large" style="text-align: center;height: auto;">2023-03-04<br/>|<br/>2023-03-22</t-tag>
                </h2>
                <h3 id="❗-BREAKING-CHANGES">❗ BREAKING CHANGES</h3>
                <ul style="list-style-type: disc;">
                    <li>
                        无操作登出时间延长至 120 秒
                    </li>
                    <li>
                        大部分输入框都禁止输入空格
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Dashboard</t-tag>:
                        Head头部由切换打开/关闭改为点击（按屏幕尺寸决定是否启用）
                    </li>
                    <li>dashboard接口更新 (<a
                            href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/issue/2">issue
                            #2</a>)
                        @Wesley(<a
                            href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/pull/22">#22</a>)
                    </li>
                </ul>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">数据管理</t-tag>: 借出数据管理[修改、删除] (未实现)
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Guide</t-tag>: 引导层
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Input</t-tag>: 禁止输入空格
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">借出、归还</t-tag>
                        <ul>
                            <li>设备code输入框自动focus</li>
                            <li>显示借出人与操作人</li>
                        </ul>
                    </li>
                </ul>
                <h3 id="🚀-Update">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        超时弹窗规则更新
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <!---->
                    <li>
                        <t-tag size="small" theme="danger" variant="light">修复已知问题</t-tag>:
                        <ul>
                            <li>借出/归还后输入框未清空</li>
                            <li>帮借(转借)/帮还失败</li>
                            <li>超时未退出登录 (<a
                                    href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/issue/12">issue
                                    #12</a>) @Wesley(<a
                                    href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/pull/13">#13</a>)
                            </li>
                            <li>超时蒙层导致无法使用</li>
                            <li>找不到设备但仍然借出成功 @Wesley(<a
                                    href="https://github.com/OpenSourceSDZZ/MTB-Equipment-Management-System/pull/22">#22</a>)
                            </li>
                        </ul>
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 2.1.0 <t-tag theme="primary" variant="light"
                        style="background-color: var(--td-success-color-1);color: var(--td-success-color-5);margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Beta</t-tag>
                    <t-tag size="large">2023-03-03</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">设备借出、归还</t-tag>: 功能上线
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Page/Server</t-tag>: 概览 (<a
                            href="?type=dashboard">Dashboard</a>)
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">API</t-tag>:
                        <ul>
                            <li>设备借出</li>
                            <li>设备归还</li>
                            <li>设备管理-3个</li>
                            <li>账号管理-3个</li>
                            <li>仪表盘接口-5个</li>
                        </ul>
                    </li>
                </ul>
                <h3 id="🚀-Update">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">设备管理</t-tag>:
                        <ul>
                            <li>鉴权系统</li>
                        </ul>
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">账户管理</t-tag>:
                        <ul>
                            <li>鉴权系统</li>
                        </ul>
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Index</t-tag>: <t-tag size="small" theme="danger"
                            variant="light">Footer</t-tag>内容更改
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <!---->
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Theme</t-tag>: 自动与手动冲突
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 2.0.5 <t-tag theme="primary" variant="light"
                        style="background-color: var(--td-success-color-1);color: var(--td-success-color-5);margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Beta</t-tag>
                    <t-tag size="large">2023-01-05</t-tag>
                </h2>
                <h3 id="❌-Unrealized">❌ Unrealized </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">后台管理</t-tag>:
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">设备管理</t-tag>新增与删除【包括批量删除】</li>
                            <li><t-tag size="small" theme="danger" variant="light">用户管理</t-tag>全部功能</li>
                            <li><t-tag size="small" theme="danger" variant="light">任务管理</t-tag>全部功能</li>
                        </ul>
                    </li>
                </ul>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Theme</t-tag>: 样式根据时间自动切换
                    </li>
                </ul>
                <h3 id="🚀-Update">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Menu</t-tag>:
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">选项</t-tag>重载页面按钮</li>

                        </ul>
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Console</t-tag>:
                        <ul>
                            <li>Console添加样式方便定位与查看</li>
                        </ul>
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 2.0.4 <t-tag theme="primary" variant="light"
                        style="background-color: var(--td-brand-color-2);color: var(--td-brand-color-7);margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Alpha</t-tag>
                    <t-tag size="large">2022-12-17</t-tag>
                </h2>
                <h3 id="🚀-features">🚀 Update </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Function</t-tag>:
                        <ul>
                            <li>请求超时提示

                            </li>
                            <li>修改账户密码</li>
                            <li>设备借出与归还</li>
                        </ul>
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Console</t-tag>:
                        <ul>
                            <li>逐步console，方便随时Debug</li>
                        </ul>
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Timeout</t-tag>:
                        <ul>
                            <li>60内页面没有<t-tag size="small" theme="danger" variant="light">点击事件</t-tag>自动退出登录</li>
                        </ul>
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Menu</t-tag>:
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">Header-Menu</t-tag>: 顶部菜单栏</li>
                        </ul>
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">Sidebar-Menu</t-tag>: 侧边可以打开的菜单栏</li>
                        </ul>
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">More-Menu</t-tag>: More菜单栏</li>
                        </ul>
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <!---->
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Xhr(Axios)</t-tag>: 请求设置3s超时
                    </li>
                    <!---->
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Menu</t-tag>:
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">Header-Menu</t-tag>: 图标错位</li>
                        </ul>
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">Sidebar-Menu</t-tag>: 打开菜单栏时页面不会自动收缩
                            </li>
                        </ul>
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">More-Menu</t-tag>: 错位</li>
                        </ul>
                    </li>
                    <!---->
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Error</t-tag>: 异常报错
                    </li>
                    <!---->
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Function</t-tag>:
                        <ul>
                            <li>
                                <t-tag size="small" theme="danger" variant="light">Popup</t-tag>: 弹窗无法关闭以及疯狂弹窗
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <t-tag size="small" theme="danger" variant="light">Style</t-tag>: Body边缘空出一段距离
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <t-tag size="small" theme="danger" variant="light">Login</t-tag>: 登陆后需要刷新页面
                            </li>
                        </ul>
                        <ul>
                            <li><t-tag size="small" theme="danger" variant="light">Login</t-tag>: 账户密码正确但是验证失败
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <t-tag size="small" theme="danger" variant="light">Theme</t-tag>: 深色模式颜色异常
                            </li>
                        </ul>
                    </li>

                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 2.0.1 <t-tag theme="primary" variant="light"
                        style="background-color: var(--td-brand-color-2);color: var(--td-brand-color-7);margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Alpha</t-tag>
                    <t-tag size="large">2022-11-01</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        新版本发布
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="warning" class="blueline">
                <h2>🌈 2.0.0 <t-tag theme="warning" variant="light"
                        style="background-color: var(--td-warning-color-2);;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">Build</t-tag>
                    <t-tag size="large">2022-10-10</t-tag>
                </h2>
                <h3 id="🚀-features">📌 Webpack</h3>
                <ul style="list-style-type: disc;">
                    <li>
                        构建初始形态【Vue.js/ElementUI/TDesign/npm】
                    </li>
                </ul>
                <div style="height: 28px;"></div>
            </t-timeline-item>
        </t-timeline>
    </div>
    </div>
</template>


<script>
export default {
    name: 'CHANGlOG',
}
</script>


<style scoped>
div>span{
    font-size: 35px;
    color: var(--td-text-color-primary);
    padding-bottom: 16px;
}
.blueline .t-timeline-item__tail {
    border-color: var(--td-brand-color) !important;
}

.greenline .t-timeline-item__tail {
    border-color: var(--td-success-color) !important;
}

.t-timeline-item__content>h2 .t-tag {
    padding: 2px 12px;
    border-radius: 3px;
    margin-left: 24px;
    font-size: 20px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
}

ul,
dl,
ol {
    margin: 0;
    padding: 0 0 0 1.2em;
    line-height: 22px;
}

ul ul {
    list-style-type: circle;
    margin-block-start: 0px;
    margin-block-end: 0px;
}

.t-timeline-item__content>ul {
    list-style-type: disc;
}

ul>li>.t-tag {
    color: var(--td-error-color-8) !important;
    margin: 0 2px !important;
    border-radius: 3px;
    padding: 2px 6px !important;
    font-size: 12px !important;
}

ul>li>.t-tag.tagblue {
    color: var(--td-brand-color-7) !important;
    margin: 0 2px !important;
    border-radius: 3px;
    padding: 2px 6px !important;
    font-size: 12px !important;
}

html[theme-mode="dark"] ul>li>.t-tag {
    color: var(--td-error-color-6) !important;
}

li ul>li {
    font-size: 14px;
}

li>a {
    line-height: 24px;
    text-decoration: none;
    color: var(--td-text-color-link)
}

h2 {
    margin-top: 0px !important;
}

.t-timeline-item__dot .t-loading__gradient-conic {
    background: conic-gradient(from 90deg at 50% 50%, var(--td-text-color-disabled) 0deg, var(--td-text-color-primary) 360deg) !important;
}
</style>
