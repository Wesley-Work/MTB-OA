
## 🌈 3.1.0 `2025-02-16` 
### 🚨 Breaking Changes
- `MyTask`: 待完善状态。 @Wesley-0808 ([#32](https://github.com/Wesley-0808/MTB-OA/pull/32))
### 🚀 Features
- `CHANGELOG`: 从目录的`CHANGELOG.md`获取`更新日志`内容。 @Wesley-0808 ([#32](https://github.com/Wesley-0808/MTB-OA/pull/32))
- `GroupManage`: 优化`列表`弹窗`以及`抽屉编辑`功能。 @Wesley-0808 ([#32](https://github.com/Wesley-0808/MTB-OA/pull/32))
### 🚧 Others
- `MultiLanguage`:  多语言功能配置。 @Wesley-0808 ([#32](https://github.com/Wesley-0808/MTB-OA/pull/32))

## 🌈 3.0.3 `2025-02-01` 
### 🚨 Breaking Changes
- `footer`链接指向。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
### 🚀 Features
- `Router`: 优化页面权限验证，切换页面时将会验证用户是否拥有页面功能对应的权限。 @Wesley-0808 ([#11](https://github.com/Wesley-0808/MTB-OA/pull/11))
- `RecordList`: 借出记录支持数据分页 @Wesley-0808 ([#15](https://github.com/Wesley-0808/MTB-OA/pull/15))
- `Dashboard`: 新版数据报表 @Wesley-0808 ([#16](https://github.com/Wesley-0808/MTB-OA/pull/16))
- `taskManage`: 对齐线上版、优化界面 @Wesley-0808 ([#18](https://github.com/Wesley-0808/MTB-OA/pull/18))
- `UserManage`: 新增`导出数据`功能，暂未开通`数据导入`功能 @Wesley-0808 ([#19](https://github.com/Wesley-0808/MTB-OA/pull/19))
- `SystemInfo`: 新增`系统信息`页面，展示系统信息、第三方信息共享清单以及开源声明协议。 @Wesley-0808 ([#23](https://github.com/Wesley-0808/MTB-OA/pull/23))
- 新增`页面加载`时出现加载条。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
- 新增`校验权限`Hooks。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
- 新增`无实际操作权限`账号字段，用于系统功能展示等场景下使用。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
- 新增`特殊标识彩蛋`。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
- 首页支持跳转`信息详情`。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
- `Theme-Toggle`: 切换样式的动画 @Wesley
### 🐞 Bug Fixes
- `Record`: 修复判断用户是否存在的逻辑错误 @Wesley-0808 ([#19](https://github.com/Wesley-0808/MTB-OA/pull/19))
- `Lend`: 修复借出后未清空输入框内容的问题。@Wesley
- `Return`: 修复归还后未清空输入框内容的问题。@Wesley
### 📈 Performance
- `GroupManage`: `组`选项卡更大，结构优化。 @Wesley-0808 ([#23](https://github.com/Wesley-0808/MTB-OA/pull/23))
- `VerifyPermissions`: 重构`页面权限校验`功能。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
- `taskList`: 工作时间`YYYY-MM-DD HH:mm`将根据相差时间渲染，具体详情[#31](https://github.com/Wesley-0808/MTB-OA/issue/31)。 @Wesley-0808 ([#24](https://github.com/Wesley-0808/MTB-OA/pull/24))
### 🚧 Others
- `UserManage`:  `选择数据`编辑 改为 点击最后一列的`编辑`文字编辑 @Wesley-0808 ([#19](https://github.com/Wesley-0808/MTB-OA/pull/19))
- `LendReturnRecord`:  借出、归还人由借出人id变更为借出人名字 @Wesley-0808 ([#19](https://github.com/Wesley-0808/MTB-OA/pull/19))

## 🌈 0.0.1 `2024-11-25` 
### 🚀 Features
- `Lend`: 使用`组合式API`重构 @Wesley-0808 ([#7](https://github.com/Wesley-0808/MTB-OA/pull/7))
- `Return`: 使用`组合式API`重构 @Wesley-0808 ([#7](https://github.com/Wesley-0808/MTB-OA/pull/7))
- `Component`: 部分组件已对齐`v3.3.0`在线版。 @Wesley-0808 ([#8](https://github.com/Wesley-0808/MTB-OA/pull/8))
- 初始化标准 @Wesley-0808 ([#1](https://github.com/Wesley-0808/MTB-OA/pull/1))
