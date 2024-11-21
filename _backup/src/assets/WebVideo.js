export function WebVideo() {
    this.g_iWndIndex = 0
    this.szDeviceIdentify = ''
    this.deviceport = ''
    this.rtspPort = ''
    this.channels = []
    this.ip = 'http://10.0.0.164/'
    this.port = '80'
    this.username = 'admin'
    this.password = 'hik12345'
    this.init = function(ip, username, password) {
        this.ip = ip
        this.username = username
        this.password = password
        // var self = this
        // 检查插件是否已经安装过
        // var iRet = WebVideoCtrl.I_CheckPluginInstall();
        // if (-1 == iRet) {
        //     alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        //     return;
        // }
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(454, 315, {
            szColorProperty: 'plugin-background:#102749; sub-background:#102749; sub-border:#18293c; sub-border-select:red',
            bWndFull: true, // 全屏
            // iPackageType: 2,
            iWndowType: 1, //分屏
            bNoPlugin: true, // 支持无插件
            cbInitPluginComplete: function () {
                WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            }
        });
    }
    // 登录
    this.clickLogin = function () {
        var self = this
        if ("" == self.ip || "" == self.port) {
            return;
        }
        self.szDeviceIdentify = self.ip + "_" + self.port;
        WebVideoCtrl.I_Login(self.ip, 1, self.port, self.username, self.password, {
            success: function (xmlDoc) {        
                setTimeout(function () {
                    console.log('登录成功');
                    self.getChannelInfo();
                    self.getDevicePort();
                }, 10);
                setTimeout(function() {
                    self.clickStartRealPlay()
                }, 500)
            },
            error: function (status, xmlDoc) {
                console.log('登录失败');
            }
        });
    }
    // 退出
    this.clickLogout = function() {
        var self = this
        self.channels = []
 
        if (null == self.szDeviceIdentify) {
            return;
        }
        var iRet = WebVideoCtrl.I_Logout(self.szDeviceIdentify);
        if (0 == iRet) {
            self.getChannelInfo();
            self.getDevicePort();
        }
    }
    // 获取通道
    this.getChannelInfo = function() {
        var self = this
        self.channels = []
        if (null == self.szDeviceIdentify) {
            return;
        }
        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(self.szDeviceIdentify, {
            async: false,
            success: function (xmlDoc) {
                var oChannels = $(xmlDoc).find("VideoInputChannel");
                $.each(oChannels, function (i) {
                    var id = $(this).find("id").eq(0).text(),
                        name = $(this).find("name").eq(0).text();
                    if ("" == name) {
                        name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                    }
                    self.channels.push({
                        id: id,
                        name: name
                    })
                });
                console.log('获取模拟通道号成功')
            },
            error: function (status, xmlDoc) {
                console.log('获取模拟通道号失败')
            }
        });
    }
    // 获取端口
    this.getDevicePort = function() {
        var self = this
        if (null == self.szDeviceIdentify) {
            return;
        }
        var oPort = WebVideoCtrl.I_GetDevicePort(self.szDeviceIdentify);
        if (oPort != null) {
            self.deviceport = oPort.iDevicePort;
            self.rtspPort = oPort.iRtspPort;
        }
        console.log('获取端口号成功')
    }
    
    // 开始预览
    this.clickStartRealPlay = function() {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex),
            iChannelID = self.channels[0].id
    
        if (null == self.szDeviceIdentify) {
            return;
        }
        var startRealPlay = function () {
            WebVideoCtrl.I_StartRealPlay(self.szDeviceIdentify, {
                iChannelID: iChannelID,
                bZeroChannel: false,
                iStreamType: 2,
                success: function () {
                    console.log('预览成功')
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        console.log('设备不支持Websocket取流')
                    } else {
                        console.log('预览失败')
                    }
                }
            });
        };
    
        if (oWndInfo != null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop({
                success: function () {
                    startRealPlay();
                }
            });
        } else {
            startRealPlay();
        }
    }
    // 停止预览
    this.clickStopRealPlay = function() {
        var self = this
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(self.g_iWndIndex)
        if (oWndInfo != null) {
            WebVideoCtrl.I_Stop({
                success: function () {
                    console.log('停止预览成功')
                },
                error: function () {
                    console.log('停止预览失败')
                }
            });
        }
    }
}