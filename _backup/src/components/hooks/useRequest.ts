import { NotifyPlugin } from "tdesign-vue-next";
import { getAPIURL } from "./common";

function SpliceParameter(DATA:Object) {
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

export function HTTPRequest(option) {
    return new Promise((resolve, reject) => {
        try{
            if(Object.prototype.toString.call(option) !== '[object Object]') resolve(false);
            
            option.methods = option.methods ? option.methods.toUpperCase() : 'GET';
            option.data = SpliceParameter(option.data) || null;
            option.header = option.header || {};
            option.timeout = option.timeout || 10000;
            
            option.url = !option.useNormalURL ? option.url : getAPIURL() + option.url;
            
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


export default HTTPRequest