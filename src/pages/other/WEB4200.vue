<template>
    <div id="MainWindow" style="display: flex;width: 100%;flex-direction: row;">
        <div id="PreviewWindow" style="width: 1360px;aspect-ratio: 16 / 9;margin-right: 32px;min-width: 1360px;">
            <div id="divPlugin" class="plugin" style="width: 100%;height: 100%;"></div>
        </div>
        <div id="ControlPanel" style="width: 100%">
            <t-space direction="vertical" size="small" style="width: 100%;">
                <!--PTZ-->
                <div>
                    <t-space direction="horizontal" size="large">
                        <t-space direction="vertical" size="small">
                            <t-space direction="horizontal" size="small">
                                <!--左上-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-left-up" /></t-button>
                                <!--上-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-up" /></t-button>
                                <!--右上-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-right-up" /></t-button>
                            </t-space>
                            <t-space direction="horizontal" size="small">
                                <!--左-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-left" /></t-button>
                                <!--中-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="circle" /></t-button>
                                <!--右-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-right" /></t-button>
                            </t-space>
                            <t-space direction="horizontal" size="small">
                                <!--左下-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-left-down" /></t-button>
                                <!--下-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-down" /></t-button>
                                <!--右下-->
                                <t-button theme="default" variant="outline" mtb-tag-button-padding-halftag><t-icon name="arrow-right-down" /></t-button>
                            </t-space>
                        </t-space>
                        <t-space direction="vertical" size="small">
                            <t-space :size="4">
                                <t-button theme="default" variant="outline" title="放大" mtb-tag-button-padding-3-2tag><t-icon name="zoom-in" /></t-button>
                                <t-button theme="default" variant="outline" title="缩小" mtb-tag-button-padding-3-2tag><t-icon name="zoom-out" /></t-button>
                            </t-space>
                            <t-space :size="4">
                                <t-button theme="default" variant="outline" title="聚焦-" mtb-tag-button-padding-3-2tag><t-icon name="flip-to-back" /></t-button>
                                <t-button theme="default" variant="outline" title="聚焦+" mtb-tag-button-padding-3-2tag><t-icon name="flip-to-front" /></t-button>
                            </t-space>
                            <t-space :size="4">
                                <t-button theme="default" variant="outline" title="光圈-" mtb-tag-button-padding-3-2tag><t-icon name="mode-light" /></t-button>
                                <t-button theme="default" variant="outline" title="光圈+" mtb-tag-button-padding-3-2tag><t-icon name="brightness" /></t-button>
                            </t-space>
                        </t-space>
                    </t-space>
                </div>
                <!--模拟通道-->
                <div v-if="hikInfo.Analogchannels.length != 0">
                    <t-select
                      v-model="ControlPanelData.ChannelChoose"
                      label="预览通道选择"
                      placeholder="请选择预览通道（模拟通道）">
                        <t-option v-for="item in hikInfo.Analogchannels" :key="item.id" :value="item.name" :label="item.name"></t-option>
                    </t-select>
                </div>
                <!--数字通道-->
                <div v-if="hikInfo.Digitalchannels.length != 0">
                    <t-select
                      v-model="ControlPanelData.ChannelChoose"
                      label="预览通道选择"
                      placeholder="请选择预览通道（数字通道）">
                        <t-option v-for="item in hikInfo.Digitalchannels" :key="item.id" :value="item.name" :label="item.name"></t-option>
                    </t-select>
                </div>
                <!--零通道-->
                <div v-if="hikInfo.Zerochannels.length != 0">
                    <t-select
                      v-model="ControlPanelData.ChannelChoose"
                      label="预览通道选择"
                      placeholder="请选择预览通道（零通道）">
                        <t-option v-for="item in hikInfo.Zerochannels" :key="item.id" :value="item.name" :label="item.name"></t-option>
                    </t-select>
                </div>
                <div>
                    <t-button :theme="previewing ? 'danger' : 'primary'" block>{{ previewing ? '停止预览' : '开始预览' }}</t-button>
                </div>
            </t-space>
        </div>
    </div>
    <!-- <div class="left">
        <fieldset class="localconfig">
            <legend>本地配置</legend>
            <table cellpadding="0" cellspacing="3" border="0">
                <tr>
                    <td class="tt">播放性能</td>
                    <td>
                        <select id="netsPreach" name="netsPreach" class="sel">
                            <option value="0">最短延时</option>
                            <option value="1">实时性好</option>
                            <option value="2">均衡</option>
                            <option value="3">流畅性好</option>
                        </select>
                    </td>
                    <td class="tt">图像尺寸</td>
                    <td>
                        <select id="wndSize" name="wndSize" class="sel">
                            <option value="0">充满</option>
                            <option value="1">4:3</option>
                            <option value="2">16:9</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="tt">规则信息</td>
                    <td>
                        <select id="rulesInfo" name="rulesInfo" class="sel">
                            <option value="1">启用</option>
                            <option value="0">禁用</option>
                        </select>
                    </td>
                    <td class="tt">抓图文件格式</td>
                    <td>
                        <select id="captureFileFormat" name="captureFileFormat" class="sel">
                            <option value="0">JPEG</option>
                            <option value="1">BMP</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="tt">录像文件打包大小</td>
                    <td>
                        <select id="packSize" name="packSize" class="sel">
                            <option value="0">256M</option>
                            <option value="1">512M</option>
                            <option value="2">1G</option>
                        </select>
                    </td>
                    <td class="tt">协议类型</td>
                    <td>
                        <select id="protocolType" name="protocolType" class="sel">
                            <option value="0">TCP</option>
                            <option value="2">UDP</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="tt">码流秘钥</td>
                    <td colspan="3">
                        <input id="secretKey" type="password" class="txt" />
                    </td>
                </tr>
                <tr>
                    <td class="tt">录像文件保存路径</td>
                    <td colspan="3"><input id="recordPath" type="text" class="txt" />&nbsp;<input type="button" class="btn"
                            value="浏览" onclick="clickOpenFileDlg('recordPath', 0);" /></td>
                </tr>
                <tr>
                    <td class="tt">回放下载保存路径</td>
                    <td colspan="3"><input id="downloadPath" type="text" class="txt" />&nbsp;<input type="button"
                            class="btn" value="浏览" onclick="clickOpenFileDlg('downloadPath', 0);" /></td>
                </tr>
                <tr>
                    <td class="tt">预览抓图保存路径</td>
                    <td colspan="3"><input id="previewPicPath" type="text" class="txt" />&nbsp;<input type="button"
                            class="btn" value="浏览" onclick="clickOpenFileDlg('previewPicPath', 0);" /></td>
                </tr>
                <tr>
                    <td class="tt">回放抓图保存路径</td>
                    <td colspan="3"><input id="playbackPicPath" type="text" class="txt" />&nbsp;<input type="button"
                            class="btn" value="浏览" onclick="clickOpenFileDlg('playbackPicPath', 0);" /></td>
                </tr>
                <tr>
                    <td class="tt">回放剪辑保存路径</td>
                    <td colspan="3"><input id="playbackFilePath" type="text" class="txt" />&nbsp;<input type="button"
                            class="btn" value="浏览" onclick="clickOpenFileDlg('playbackFilePath', 0);" /></td>
                </tr>
                <tr>
                    <td colspan="4"><input type="button" class="btn" value="获取" onclick="clickGetLocalCfg();" />&nbsp;<input
                            type="button" class="btn" value="设置"
                            onclick="clickSetLocalCfg();" />&nbsp;&nbsp;修改参数后，需要刷新界面后生效。</td>
                </tr>
            </table>
        </fieldset>
    </div>
    <div class="left">
        <fieldset class="preview">
            <legend>预览</legend>
            <table cellpadding="0" cellspacing="3" border="0">
                <tr>
                    <td class="tt">码流类型</td>
                    <td>
                        <select id="streamtype" class="sel">
                            <option value="1">主码流</option>
                            <option value="2">子码流</option>
                            <option value="3">第三码流</option>
                            <option value="4">转码码流</option>
                        </select>
                    </td>

                </tr>
                <tr>
                    <td colspan="3">
                        <input type="button" class="btn" value="抓图" onclick="clickCapturePic('preview');" />
                        <input type="button" class="btn" value="抓图上传" onclick="clickCapturePicData();" />
                        <input type="button" class="btn" value="开始录像" onclick="clickStartRecord('realplay');" />
                        <input type="button" class="btn" value="停止录像" onclick="clickStopRecord('realplay');" />
                    </td>
                </tr>
            </table>
        </fieldset>
        <fieldset class="ptz">
            <legend>云台控制</legend>
            <table cellpadding="0" cellspacing="3" border="0" class="left">
                <tr>
                    <td>
                        <input type="button" class="btn" value="左上" onmousedown="mouseDownPTZControl(5);"
                            onmouseup="mouseUpPTZControl();" />
                        <input type="button" class="btn" value="上" onmousedown="mouseDownPTZControl(1);"
                            onmouseup="mouseUpPTZControl();" />
                        <input type="button" class="btn" value="右上" onmousedown="mouseDownPTZControl(7);"
                            onmouseup="mouseUpPTZControl();" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="button" class="btn" value="左" onmousedown="mouseDownPTZControl(3);"
                            onmouseup="mouseUpPTZControl();" />
                        <input type="button" class="btn" value="自动" onclick="mouseDownPTZControl(9);" />
                        <input type="button" class="btn" value="右" onmousedown="mouseDownPTZControl(4);"
                            onmouseup="mouseUpPTZControl();" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="button" class="btn" value="左下" onmousedown="mouseDownPTZControl(6);"
                            onmouseup="mouseUpPTZControl();" />
                        <input type="button" class="btn" value="下" onmousedown="mouseDownPTZControl(2);"
                            onmouseup="mouseUpPTZControl();" />
                        <input type="button" class="btn" value="右下" onmousedown="mouseDownPTZControl(8);"
                            onmouseup="mouseUpPTZControl();" />
                    </td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="3" border="0" class="left">
                <tr>
                    <td class="tt">云台速度</td>
                    <td>
                        <select id="ptzspeed" class="sel">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4" selected>4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="tt">预置点号</td>
                    <td><input id="preset" type="text" class="txt" value="1" /></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="button" class="btn" value="设置" onclick="clickSetPreset();" />
                        <input type="button" class="btn" value="调用" onclick="clickGoPreset();" />
                    </td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="3" border="0" class="left">
                <tr>
                    <td class="tt"><input type="button" class="btn2" value="变倍+" onmousedown="PTZZoomIn()"
                            onmouseup="PTZZoomStop()"></td>
                    <td><input type="button" class="btn2" value="变倍-" onmousedown="PTZZoomout()" onmouseup="PTZZoomStop()">
                    </td>
                </tr>
                <tr>
                    <td class="tt"><input type="button" class="btn2" value="变焦+" onmousedown="PTZFocusIn()"
                            onmouseup="PTZFoucusStop()"></td>
                    <td><input type="button" class="btn2" value="变焦-" onmousedown="PTZFoucusOut()"
                            onmouseup="PTZFoucusStop()"></td>
                </tr>
                <tr>
                    <td class="tt"><input type="button" class="btn2" value="光圈+" onmousedown="PTZIrisIn()"
                            onmouseup="PTZIrisStop()"></td>
                    <td><input type="button" class="btn2" value="光圈-" onmousedown="PTZIrisOut()" onmouseup="PTZIrisStop()">
                    </td>
                </tr>
            </table>
        </fieldset>
        <fieldset class="playback">
            <legend>回放</legend>
            <table width="100%" cellpadding="0" cellspacing="3" border="0">
                <tr>
                    <td class="tt">码流类型</td>
                    <td>
                        <select id="record_streamtype" class="sel">
                            <option value="1">主码流</option>
                            <option value="2">子码流</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="tt">开始时间</td>
                    <td>
                        <input id="starttime" type="text" class="txt" value="2013-12-10 00:00:00" />（时间格式：2013-11-11
                        12:34:56）
                    </td>
                </tr>
                <tr>
                    <td class="tt">结束时间</td>
                    <td>
                        <input id="endtime" type="text" class="txt" value="2013-12-11 23:59:59" />
                        <input type="button" class="btn" value="搜索" onclick="clickRecordSearch(0);" />
                        <input type="button" class="btn" value="停止下载" onclick="clickStopDownload();" />
                    </td>
                </tr>
                <tr>
                    <td class="tt">按时间下载开始时间</td>
                    <td>
                        <input id="downloadstarttime" type="text" class="txt" value="2013-12-10 00:00:00" />（时间格式：2013-11-11
                        12:34:56）
                    </td>
                </tr>
                <tr>
                    <td class="tt">按时间下载结束时间</td>
                    <td>
                        <input id="downloadendtime" type="text" class="txt" value="2013-12-11 23:59:59" />
                        <input type="button" class="btn" value="下载" onclick="clickStartDownloadRecordByTime();" />（相机不支持）
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div id="searchdiv" class="searchdiv">
                            <table id="searchlist" class="searchlist" cellpadding="0" cellspacing="0" border="0"></table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="button" class="btn2" value="开始回放" onclick="clickStartPlayback();" />
                        <input type="button" class="btn2" value="停止回放" onclick="clickStopPlayback();" />
                        <input id="btnReverse" type="button" class="btn" value="倒放" onclick="clickReversePlayback();" />
                        <input type="button" class="btn" value="单帧" onclick="clickFrame();" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="button" class="btn" value="暂停" onclick="clickPause();" />
                        <input type="button" class="btn" value="恢复" onclick="clickResume();" />
                        <input type="button" class="btn" value="慢放" onclick="clickPlaySlow();" />
                        <input type="button" class="btn" value="快放" onclick="clickPlayFast();" />
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input type="button" class="btn" value="抓图" onclick="clickCapturePic('playback');" />
                    </td>
                </tr>
            </table>
        </fieldset>
    </div> -->
    <!---->
</template>

<script>

import { NotifyPlugin } from "tdesign-vue-next";

export default {
    name: "Web4200",
    data() {
      return {
        hikInfo: {
          ip: '10.0.0.164',//海康威视摄像头/硬盘录像机的ip地址
          port: '80',//海康威视摄像头/硬盘录像机的端口
          username: 'admin',//海康威视摄像头/硬盘录像机的用户名
          password: 'hik12345',//海康威视摄像头/硬盘录像机的密码
          Analogchannels: [],
          Digitalchannels: [],
          Zerochannels: [],
          szDeviceIdentify: "",
          deviceport: '',
          rtspPort: '',
          g_iWndIndex: '',
        },
        mySelectWnd: 0,//当前选中的窗口
        g_bPTZAuto: false,
        iProtocol: 1,
        loginLoading: false,
        startPlayLoading: false,
        iStreamType: 1,
        bZeroChannel: false,
        iRtspPort: 0,
        previewing: false,
        /***/
        ControlPanelData:{
            ChannelChoose: null,
        }
      }
    },
    mounted() {
    //   this.videoInitPlugin(); // 初始化video界面
    //   this.onLogin()
        // var iRet = WebVideoCtrl.I_CheckPluginInstall();
        // if (iRet == -1) {
            
        // }
        // console.log(iRet)

        // 全局保存当前选中窗口
        var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
        var g_oLocalConfig = null; //本地配置
                
        //错误码        
        //通用错误
        var ERROR_CODE_UNKNOWN = 1000; //未知错误
        var ERROR_CODE_NETWORKERROR = 1001; //网络错误
        var ERROR_CODE_PARAMERROR = 1002; //缺少插件元素
                
        //登录模块
        var ERROR_CODE_LOGIN_NOLOGIN = 2000; // 未登录
        var ERROR_CODE_LOGIN_REPEATLOGIN = 2001; //设备已登录，重复登录
        var ERROR_CODE_LOGIN_NOSUPPORT = 2002; //当前设备不支持Digest登录
                
        //预览播放
        var ERROR_CODE_PLAY_PLUGININITFAIL = 3000; //插件初始化失败
        var ERROR_CODE_PLAY_NOREPEATPLAY = 3001; //当前窗口已经在预览
        var ERROR_CODE_PLAY_PLAYBACKABNORMAL = 3002; //回放异常
        var ERROR_CODE_PLAY_PLAYBACKSTOP = 3003; //回放停止
        var ERROR_CODE_PLAY_NOFREESPACE = 3004; //录像过程中，硬盘容量不足
                
                
        var version="V3.3.0build20230322"
        var self = this.$data.hikInfo
        var that = this

        // WebVideoCtrl.I_InitPlugin({
        //     bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        //     iWndowType: 1,
        //     bDebugMode: false,
        //     cbEvent: function (iEventType, iParam1, iParam2) {
        //         if (2 == iEventType) {// 回放正常结束
        //             NotifyPlugin.info({
        //                 message: "窗口" + iParam1 + "回放结束！",
        //                 duration: 2500,
        //             })
        //         } else if (-1 == iEventType) {
        //             NotifyPlugin.info({
        //                 message: "设备" + iParam1 + "网络错误！",
        //                 duration: 2500,
        //             })
        //         } else if (3001 == iEventType) {
        //             clickStopRecord(g_szRecordType, iParam1);
        //         }
        //     },
        //     cbInitPluginComplete: function () {
        //         WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin").then(() => {
        //             if ("" == self.ip || "" == self.port) {
        //                 NotifyPlugin.error({
        //                     message: "设备ip及端口号错误，加载插件失败",
        //                     duration: 2500,
        //                 })
        //                 return;
        //             }
        //             self.szDeviceIdentify = self.ip + "_" + self.port;
        //             // login
        //             WebVideoCtrl.I_Login(self.ip, 1, self.port, self.username, self.password, {
        //                 success: function (xmlDoc) {        
        //                     console.log('登录成功')
        //                     NotifyPlugin.success({
        //                         message: "登录成功",
        //                         duration: 2500,
        //                     })
        //                 },
        //                 error: function (status, xmlDoc) {
        //                     console.log('登录失败')
        //                     NotifyPlugin.error({
        //                         message: "登录失败，"+xmlDoc,
        //                         duration: 2500,
        //                     })
        //                 }
        //             }).then((res) => {
        //                 that.Init_MainInformation()
        //             },(err) => {
        //                 if (err.errorCode === 2001){
        //                     // Already login
        //                     that.Init_MainInformation()
        //                 }
        //             });
        //         }, () => {
        //             alert("Hikvision-Web插件初始化失败，请确认是否已安装插件，如果未安装，请下载安装HCWebSDKPlugin.exe！");
        //         });
        //     }
        // });

        // window.onresize = function () {
        //     WebVideoCtrl.I_Resize($("#divPlugin").width(), $("#divPlugin").height());
        // }
        
        // window.onscroll = function () {
        //     WebVideoCtrl.I_Resize($("#divPlugin").width(), $("#divPlugin").height());
        // }
    },

    unmounted() {
        WebVideoCtrl.I_DestroyPlugin().then((e) => {
            console.log("destroyed",e)
        },(e) => { console.log(e) });
    },

    destroyed: function () {
      this.clickStopRealPlay();
      this.onLogout();
    },
    methods: {


        /**
         * @Init_MainInformation
         * @初始化-加载主要信息
         */
        async Init_MainInformation(){
            try{
                // 获取通道信息
                await this.getChannelInfo()
                // 获取设备端口号
                await this.getDevicePort()
            }
            catch(err){
                NotifyPlugin.error({
                    title: "获取主要信息失败",
                    message: err,
                    duration: 4000,
                })
            }
        },

        // 获取模拟通道信息
        getChannelInfo() {
            var self = this.$data.hikInfo
            var szDeviceIdentify = self.szDeviceIdentify
            self.Analogchannels = []
            self.Digitalchannels = []
            self.Zerochannels = []
            if (null == szDeviceIdentify) {
                return;
            }
            // 模拟通道
            return new Promise(function (resolve, reject) {
                // 模拟通道
                WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
                    success: function (xmlDoc) {
                        var oChannels = $(xmlDoc).find("VideoInputChannel");
                        $.each(oChannels, function (i) {
                            var id = $(this).find("id").eq(0).text(),
                                name = $(this).find("name").eq(0).text();
                            if ("" == name) {
                                name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                            }
                            self.Analogchannels.push({
                                id: id,
                                name: name
                            })
                        });
                        resolve(self.Analogchannels)
                    },
                    error: function (oError) {
                        reject(" 获取模拟通道失败！", oError.errorCode, oError.errorMsg)
                    }
                });
                // 数字通道
                // WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
                //     success: function (xmlDoc) {
                //         var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
                //         $.each(oChannels, function (i) {
                //             var id = $(this).find("id").eq(0).text(),
                //                 name = $(this).find("name").eq(0).text(),
                //                 online = $(this).find("online").eq(0).text();
                //             if ("" == name) {
                //                 name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                //             }
                //             self.Digitalchannels.push({
                //                 id: id,
                //                 name: name,
                //                 online: online
                //             })
                //         });
                //         resolve(self.Digitalchannels)
                //     },
                //     error: function (oError) {
                //         reject(" 获取数字通道失败！", oError.errorCode, oError.errorMsg)
                //     }
                // });
                // // 零通道
                // WebVideoCtrl.I_GetZeroChannelInfo(szDeviceIdentify, {
                //     success: function (xmlDoc) {
                //         var oChannels = $(xmlDoc).find("ZeroVideoChannel");
                //         $.each(oChannels, function (i) {
                //             var id = $(this).find("id").eq(0).text(),
                //                 name = $(this).find("name").eq(0).text();
                //                 enabled = $(this).find("enabled").eq(0).text()
                //             if ("" == name) {
                //                 name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : (i + 1));
                //             }
                //             self.Zerochannels.push({
                //                 id: id,
                //                 name: name,
                //                 enabled: enabled,
                //             });
                //         });
                //         resolve(self.Zerochannels)
                //     },
                //     error: function (oError) {
                //         reject(" 获取零通道失败！", oError.errorCode, oError.errorMsg)
                //     }
                // });
            });
        },
        // 获取设备端口号
        getDevicePort() {
            var self = this.$data.hikInfo
            return new Promise(function (resolve, reject) {
                if (null == self.szDeviceIdentify) {
                    reject('获取端口号失败')
                }
                WebVideoCtrl.I_GetDevicePort(self.szDeviceIdentify).then((oPort) => {
                    if (oPort != null) {
                        self.deviceport = oPort.iDevicePort;
                        self.rtspPort = oPort.iRtspPort;
                    }
                    console.log('获取端口号成功')
                    console.log(self)
                    resolve(oPort)
                }, (oError) => {
                    reject('获取端口号失败',oError.errorCode, oError.errorMsg)
                })
            })
        },
        // 开始预览播放
        startPreview(ChannelId){
            var self = this.$data.hikInfo
            console.log(self)
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
                }).catch((err) => {
                    console.log(err)
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
        },
    }
}
</script>

<style>

[mtb-tag-button-padding-halftag]{
    padding-left: calc(var(--td-comp-paddingLR-l) - var(--td-comp-paddingLR-l) / 2) !important;
    padding-right: calc(var(--td-comp-paddingLR-l) - var(--td-comp-paddingLR-l) / 2) !important;
}

[mtb-tag-button-padding-3-2tag]{
    padding-left: calc(var(--td-comp-paddingLR-l) - var(--td-comp-paddingLR-l) / 4) !important;
    padding-right: calc(var(--td-comp-paddingLR-l) - var(--td-comp-paddingLR-l) / 4) !important;
}

</style>
