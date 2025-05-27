
## 🌈 3.4.0 `2025-05-27` 
### 🚀 Features
- `Audit`:
  - `Manage`: 审批管理功能 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
  - `Post`: 发起审批功能，仅支持发起`设备借出审批 / 任务审批 / 其他审批` @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
  - `Progress`: 审批进度功能 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `Network`:
  - `Verify`: 用户上网绑定设备管理 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
  - `Code`: 上网码管理 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `Route`: 新增路由记忆功能，将记录上次访问的页面，记录24小时内有效 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `RecordList`: 支持筛选单页记录 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `SSO`: 适配`SSO v3.0` @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `API`: `v2.6.10 -> v2.7.16` @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
### 🐞 Bug Fixes
- `Index`:
  - 修复系统初始化时修改`地址参数`不符合预期效果的问题 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
  - 修复`3.3.3`版本，切换组件时动画异常的问题 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
  - 修复`Token`过期后，出现多个弹窗的异常现象 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `TaskList`: 修复全部任务已经完成时，表格一直显示为加载态的问题 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- `TaskManage`: 修复编辑任务，权重等级无法修改的问题 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
### 🚧 Others
- 更新`任务管理`三个功能的菜单图标 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
- 优化项目，移除无用内容 @Wesley-0808 ([#56](https://github.com/Wesley-Work/MTB-OA/pull/56))
## 🌈 3.3.3 `2025-04-25` 
### 🐞 Bug Fixes
- `UserManage`: 修复提交更新用户信息后，遇后端错误无错误内容显示的问题 @Wesley-0808 ([#53](https://github.com/Wesley-Work/MTB-OA/pull/53))
- `Index`: 
  - 修复切换动画时闪目标页面的问题 @Wesley-0808 ([#53](https://github.com/Wesley-Work/MTB-OA/pull/53))
  - 修复网页图标无法正确加载的问题 @Wesley-0808 ([#53](https://github.com/Wesley-Work/MTB-OA/pull/53))
- `SuppleRecord`: 修复点击添加借出记录按钮无反馈的问题 @Wesley-0808 ([#55](https://github.com/Wesley-Work/MTB-OA/pull/55))
### 🚧 Others
- `EquipmentManage`: 更新设备列表不会改变分页内容 @Wesley-0808 ([#53](https://github.com/Wesley-Work/MTB-OA/pull/53))
- `UserManage`: 更新用户列表不会改变分页内容 @Wesley-0808 ([#53](https://github.com/Wesley-Work/MTB-OA/pull/53))
## 🌈 3.3.2 `2025-04-20` 
### 🐞 Bug Fixes
- `EqList`: 修复点击编辑未同步选择行数据的问题 @Wesley-0808 ([#51](https://github.com/Wesley-Work/MTB-OA/pull/51))
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
