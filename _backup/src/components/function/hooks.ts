import { config } from "@/components/config.js";
import { NotifyPlugin } from "tdesign-vue-next";


function SpliceParameter(DATA) {
    if (Object.prototype.toString.call(DATA) !== '[object Object]') return false;
    // PASS
    var ParameterOBJ = []
    var JSONLENGTH = DATA.length;
    if (JSONLENGTH <=0) return false;
    for (const [key, value] of Object.entries(DATA)){
        var keys = encodeURIComponent(key);
        var values = value === null ? '' : encodeURIComponent(value);
        ParameterOBJ.push(`${keys}=${values}`)
    }
    var ParameterSRT = ParameterOBJ.join('&');
    return ParameterSRT
}

function HTTPRequest(option) {
    return new Promise((resolve, reject) => {
        try{
            if(Object.prototype.toString.call(option) !== '[object Object]') resolve(false);
            
            option.methods = option.methods ? option.methods.toUpperCase() : 'GET';
            option.data = SpliceParameter(option.data) || null;
            option.header = option.header || {};
            option.timeout = option.timeout || 10000;
            
            const xhr = new XMLHttpRequest();
            xhr.open(option.methods, option.url, true);
            if (option.header != {}) {
                for (const [key, value] of Object.entries(option.header)){
                    xhr.setRequestHeader(key, value)
                }
            }
            xhr.timeout = option.timeout;
            xhr.ontimeout = () => {
                if(option.error && typeof option.error === 'function') {
                    option.error(new Error('RequestTimeout',xhr))
                }
                else{
                    console.log('RequestTimeout: ',xhr)
                }
            };
            xhr.onload = () => {
                if(xhr.status === 200) {
                    var RES = JSON.parse(xhr.response);
                    if(RES.errcode === -1003) {
                        console.error("Token Timeout!")
                        if(option.error && typeof option.error === 'function') {
                            option.error(new Error(xhr.statusText, xhr))
                        }
                        if (config.login_verify) {
                            NotifyPlugin("error",{
                                title: '登录已过期，请重新登录',
                                duration: 0,
                            })
                            setTimeout(() => {
                                location.href = config.API_URL.login_url
                            }, 2000)
                        }
                    }
                    else if (RES.errcode === -1005){
                        NotifyPlugin("error",{ 
                            title: "操作失败",
                            content: "无权限！"
                        })
                    }
                    else{
                        // RequestSuccess
                        if(option.success && typeof option.success === 'function') {
                            option.success(xhr.response)
                        }
                    }
                }
                else{
                    if(option.error && typeof option.error === 'function') {
                        option.error(new Error(xhr.statusText, xhr))
                    }
                    else{
                        console.error('RequestError: ',xhr)
                    }
                }
            };
            xhr.onerror = () => {
                if(option.error && typeof option.error === 'function') {
                    option.error(new Error(xhr.statusText, xhr))
                }
                else{
                    console.error('RequestError: ',xhr)
                }
            };
            xhr.send(option.data);
        }
        catch(e){
            console.error("XHR Module Error: ",e)
        }
    })
}

function VerifyToken() {
    return new Promise(async (resolve, reject) => {
        const TOKEN = localStorage.getItem('token')
        if (!TOKEN) resolve(false);
        await HTTPRequest({
            url: config.API_URL.MAIN_URL + "/checkToken",
            methods: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "token": TOKEN
            },
            success: function(res) {
                var RES = JSON.parse(res)
                if (RES.errcode == 0) {
                    if (RES.data.verify === true) {
                        resolve(true)
                    }
                    else{
                        resolve(false)
                    }
                }
            },
            error: function(err) {
                console.error(err)
                resolve(false)
            }
        })
    })
}

function VerifyPermissions(PERMISSIONS){
    const TOKEN = localStorage.getItem('token')
    if (!TOKEN) return false;
    return new Promise(async (resolve, reject) => {
        await HTTPRequest({
            url: config.API_URL.MAIN_URL + "/verifyPermissions",
            methods: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "token": TOKEN
            },
            data: {
                permissions: PERMISSIONS
            },
            success: function(res) {
                var RES = JSON.parse(res)
                if (RES.errcode == 0) {
                    if (RES.data.verify == true) {
                        resolve(true)
                    }
                    else{
                        resolve(false)
                    }
                }
            },
            error: function(err) {
                console.error(err)
                resolve(false)
            }
        })
    })
}

function VerifyLocalPermissions(PERMISSIONS){
    var LocalPermissions = localStorage.getItem("permissions")
    if ((LocalPermissions & PERMISSIONS) == PERMISSIONS) {    
        return true
    }
    else{
        return false
    }
}

function applyParmer(p:Object) {
    
}

function GetAPIUrl(){
    import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://api.mtb.wesley.net.cn/'
}

function GetSSOUrl(){
    import.meta.env.VITE_SSO_URL ? import.meta.env.VITE_SSO_URL : '//10.3.146.13'
}

function GetOAUrl(){
    import.meta.env.VITE_OA_URL ? import.meta.env.VITE_OA_URL : '//10.3.146.12'
}



export { HTTPRequest, VerifyToken, VerifyPermissions, VerifyLocalPermissions, GetAPIUrl, GetSSOUrl, GetOAUrl }
