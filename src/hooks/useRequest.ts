import { NotifyPlugin } from "tdesign-vue-next";
import { getAPIURL, getLoginURL } from "./common";
import { config } from "../components/config"
import { RequestHooksOptions } from "@/types/type";
import isObject from "lodash/isObject"
function SpliceParameter(DATA:Object) {
    if (Object.prototype.toString.call(DATA) !== '[object Object]') return false;
    // PASS
    var ParameterOBJ = []
    for (const [key, value] of Object.entries(DATA)){
        var keys = encodeURIComponent(key);
        var values = value === null ? '' : encodeURIComponent(value);
        ParameterOBJ.push(`${keys}=${values}`)
    }
    var ParameterSRT = ParameterOBJ.join('&');
    return ParameterSRT
}

export function useRequest(option: RequestHooksOptions) {
    return new Promise((resolve, reject) => {
        try{
            function emitComplete(xhr) {
                if(option.complete && typeof option.complete === 'function') {
                    option.complete(xhr)
                }
            }
            function emitError(et, xhr) {
                if(option.error && typeof option.error === 'function') {
                    option.error(et, xhr)
                }
                else{
                    console.log(et, xhr)
                }
                emitComplete(xhr)
            }
            function emitSuccess(xhr) {
                if(option.success && typeof option.success === 'function') {
                    option.success(xhr.response)
                }
                emitComplete(xhr)
            }
            if(Object.prototype.toString.call(option) !== '[object Object]') resolve(false);
            
            option.methods = option.methods ? option.methods.toUpperCase() : 'GET';
            option.data = SpliceParameter(option.data) || null;
            option.header = option.header || {};
            option.timeout = option.timeout || 60000;
            option.url = option.useCustomURL ? option.url : getAPIURL() + option.url;
            
            const xhr = new XMLHttpRequest();
            xhr.open(option.methods, option.url, true);
            for (const [key, value] of Object.entries(option.header)){
                xhr.setRequestHeader(key, value)
            }
            
            xhr.timeout = option.timeout;
            xhr.ontimeout = () => {
                emitError('RequestTimeout',xhr)
            };
            xhr.onload = () => {
                if(xhr.status === 200) {
                    var RES = JSON.parse(xhr.response);
                    if(RES.errcode === -1003) {
                        console.error("Token Timeout!")
                        emitError("TokenTimeout", xhr)
                        if (config.login_verify) {
                            NotifyPlugin("error",{
                                title: '登录已过期，请重新登录',
                                duration: 0,
                            })
                            setTimeout(() => {
                                location.href = getLoginURL()
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
                        emitSuccess(xhr)
                    }
                }
                else{
                    emitError("RequestError",xhr)
                }
            };
            xhr.onerror = () => {
                emitError("RequestError",xhr)
            };
            xhr.send(option.data);
        }
        catch(e){
            console.error("XHR Module Error: ",e)
        }
    })
}


export default useRequest