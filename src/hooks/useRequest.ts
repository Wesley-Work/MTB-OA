import { NotifyPlugin } from "tdesign-vue-next";
import { getAPIURL, getLoginURL, getToken } from "./common";
import { config } from "../components/config"
import { RequestHooksOptions } from "@/types/type";
import isFunction from "lodash/isFunction"
import merge from "lodash/merge";
import { omit } from "lodash";
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
    return new Promise(async (resolve, reject) => {
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
                console.log(et, xhr)
                emitComplete(xhr)
            }
            function emitSuccess(xhr) {
                if(option.success && typeof option.success === 'function') {
                    option.success(xhr)
                }
                emitComplete(xhr)
            }
            if(Object.prototype.toString.call(option) !== '[object Object]') resolve(false);
            
            // 0116: 改Fetch
            var headers = {};
            // 优先header使用提供的内容 若没提供则使用默认值
            headers["Content-Type"] = option?.header?.["Content-Type"] ?? "application/x-www-form-urlencoded; charset=UTF-8";
            headers["TOKEN"] = option?.token ?? option?.header?.["TOKEN"] ?? getToken() ?? null;
            // 合并两个object 排除上面两项
            var headersMerge = merge(headers,omit(option?.header,["Content-Type","TOKEN","token"]));
            // 中止器
            await fetch(option?.useCustomURL ? option?.url : getAPIURL() + option?.url, {
                method: option?.methods ? option?.methods.toUpperCase() : 'GET',
                headers: {
                    ...headersMerge,
                },
                body: SpliceParameter(option?.data) || null,
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else{
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                if(data.errcode === -1003) {
                    console.error("Token Timeout!")
                    emitError("TokenTimeout", data)
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
                else if (data.errcode === -1005){
                    NotifyPlugin("error",{ 
                        title: "操作失败",
                        content: "无权限！"
                    })
                }
                else{
                    emitSuccess(JSON.stringify(data))
                }
            })
            .catch((err) => {
                emitError("RequestError",err)
            })
            .finally(() => {
                
            })
        }
        catch(e){
            console.error("XHR Module Error: ",e)
        }
    })
}


export default useRequest