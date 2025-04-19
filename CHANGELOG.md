
## 🌈 3.3.1 `2025-04-19` 
### 🚀 Features
- `Update`: 新增更新检测功能，将在每个用户打开系统时检测是否有新的`Relese`版本，如有则提示用户 @Wesley-0808 ([#48](https://github.com/Wesley-Work/MTB-OA/pull/48))
### 🐞 Bug Fixes
- `Menu`: 修复菜单权限判断逻辑问题 @Wesley-0808 ([#48](https://github.com/Wesley-Work/MTB-OA/pull/48))
## 🌈 3.3.0 `2025-04-19` 
### 🚀 Features
- `Theme`: 新增切换样式时的动画 @Wesley-0808 ([#44](https://github.com/Wesley-Work/MTB-OA/pull/44))
### 🐞 Bug Fixes
- `GroupManage`:
  - 修复新增、编辑组信息后，抽屉没有关闭的问题 @Wesley-0808 ([#44](https://github.com/Wesley-Work/MTB-OA/pull/44))
  - 修复新增组信息，抽屉内容未清空的问题 @Wesley-0808 ([#44](https://github.com/Wesley-Work/MTB-OA/pull/44))
- `Components`: 修复部分已知问题，完善用户体验 @Wesley-0808 ([#44](https://github.com/Wesley-Work/MTB-OA/pull/44))
### 📈 Performance
- `EqList`: 重构`设备管理` @Wesley-0808 ([#44](https://github.com/Wesley-Work/MTB-OA/pull/44))
### 🚧 Others
- `ShareNetDisk`: 优化`共享网盘管理`页面 @Wesley-0808 ([#44](https://github.com/Wesley-Work/MTB-OA/pull/44))
## 🌈 3.2.1 `2025-04-06` 
### 🐞 Bug Fixes
- `WebManage`: 修复`header`配置排序无效的问题 @Wesley-0808 ([#41](https://github.com/Wesley-Work/MTB-OA/pull/41))
### 🚧 Others
- `chore`: 更正仓库地址 @Wesley-0808 ([#41](https://github.com/Wesley-Work/MTB-OA/pull/41))
## 🌈 3.2.0 `2025-03-24`
### 🚀 Features
- `OfficialManage`: 支持管理官网页面内容（顶部菜单、中部轮播框及共享网盘等内容） @Wesley-0808 ([#39](https://github.com/Wesley-Work/MTB-OA/pull/39))
### 🚧 Others
- `chore`: 规范格式化 @Wesley-0808 ([#39](https://github.com/Wesley-Work/MTB-OA/pull/39))
## 🌈 3.1.0 `2025-02-16`
### 🚨 Breaking Changes
- `MyTask`: 待完善状态。 @Wesley-0808 ([#32](https://github.com/Wesley-Work/MTB-OA/pull/32))
- `LR RECORD`: `BACKEND_v2.6.10`，`借出人id`变更为`借出人名字`。 @Wesley-0808
### 🚀 Features
- `CHANGELOG`: 从目录的`CHANGELOG.md`获取`更新日志`内容。 @Wesley-0808 ([#32](https://github.com/Wesley-Work/MTB-OA/pull/32))
- `GroupManage`: 优化`列表`弹窗`以及`抽屉编辑`功能。 @Wesley-0808 ([#32](https://github.com/Wesley-Work/MTB-OA/pull/32))
- `CONFIG`: 新增`页面权限验证`、`菜单权限验证`配置 @Wesley-0808 ([#36](https://github.com/Wesley-Work/MTB-OA/pull/36))
- `Menu`: 新增`页面权限验证`、`菜单权限验证`配置 @Wesley-0808 ([#36](https://github.com/Wesley-Work/MTB-OA/pull/36))
- `PAGE`: 新增`页面权限验证`、`菜单权限验证`配置 @Wesley-0808 ([#36](https://github.com/Wesley-Work/MTB-OA/pull/36))
### 🐞 Bug Fixes
- `PERMISSION`: 修复`后端`,权限验证异常。@Wesley-0808
- `Lend`: 修复`后端`,`借出人code`为空时，会判断借出为`访客借出`的问题。@Wesley-0808
### 🚧 Others
- `MultiLanguage`:  多语言功能配置。 @Wesley-0808 ([#32](https://github.com/Wesley-Work/MTB-OA/pull/32))

## 🌈 3.0.3 `2025-02-01`
### 🚨 Breaking Changes
- `footer`链接指向。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
### 🚀 Features
- `Router`: 优化页面权限验证，切换页面时将会验证用户是否拥有页面功能对应的权限。 @Wesley-0808 ([#11](https://github.com/Wesley-Work/MTB-OA/pull/11))
- `RecordList`: 借出记录支持数据分页 @Wesley-0808 ([#15](https://github.com/Wesley-Work/MTB-OA/pull/15))
- `Dashboard`: 新版数据报表 @Wesley-0808 ([#16](https://github.com/Wesley-Work/MTB-OA/pull/16))
- `taskManage`: 对齐线上版、优化界面 @Wesley-0808 ([#18](https://github.com/Wesley-Work/MTB-OA/pull/18))
- `UserManage`: 新增`导出数据`功能，暂未开通`数据导入`功能 @Wesley-0808 ([#19](https://github.com/Wesley-Work/MTB-OA/pull/19))
- `SystemInfo`: 新增`系统信息`页面，展示系统信息、第三方信息共享清单以及开源声明协议。 @Wesley-0808 ([#23](https://github.com/Wesley-Work/MTB-OA/pull/23))
- 新增`页面加载`时出现加载条。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
- 新增`校验权限`Hooks。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
- 新增`无实际操作权限`账号字段，用于系统功能展示等场景下使用。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
- 新增`特殊标识彩蛋`。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
- 首页支持跳转`信息详情`。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
- `Theme-Toggle`: 切换样式的动画 @Wesley
### 🐞 Bug Fixes
- `Record`: 修复判断用户是否存在的逻辑错误 @Wesley-0808 ([#19](https://github.com/Wesley-Work/MTB-OA/pull/19))
- `Lend`: 修复借出后未清空输入框内容的问题。@Wesley-0808
- `Return`: 修复归还后未清空输入框内容的问题。@Wesley-0808
### 📈 Performance
- `GroupManage`: `组`选项卡更大，结构优化。 @Wesley-0808 ([#23](https://github.com/Wesley-Work/MTB-OA/pull/23))
- `VerifyPermissions`: 重构`页面权限校验`功能。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
- `taskList`: 工作时间`YYYY-MM-DD HH:mm`将根据相差时间渲染，具体详情[#31](https://github.com/Wesley-Work/MTB-OA/issue/31)。 @Wesley-0808 ([#24](https://github.com/Wesley-Work/MTB-OA/pull/24))
### 🚧 Others
- `UserManage`:  `选择数据`编辑 改为 点击最后一列的`编辑`文字编辑 @Wesley-0808 ([#19](https://github.com/Wesley-Work/MTB-OA/pull/19))
- `LendReturnRecord`:  借出、归还人由借出人id变更为借出人名字 @Wesley-0808 ([#19](https://github.com/Wesley-Work/MTB-OA/pull/19))

## 🌈 0.0.1 `2024-11-25`
### 🚀 Features
- `Lend`: 使用`组合式API`重构 @Wesley-0808 ([#7](https://github.com/Wesley-Work/MTB-OA/pull/7))
- `Return`: 使用`组合式API`重构 @Wesley-0808 ([#7](https://github.com/Wesley-Work/MTB-OA/pull/7))
- `Component`: 部分组件已对齐`v3.3.0`在线版。 @Wesley-0808 ([#8](https://github.com/Wesley-Work/MTB-OA/pull/8))
- 初始化标准 @Wesley-0808 ([#1](https://github.com/Wesley-Work/MTB-OA/pull/1))
