import { routerMap } from "../components/config";
import isNumber from 'lodash/isNumber';

const applyParmer = (parmer:Object) => {
    const keys:string[] = Object.keys(parmer);
    const kv:string[] = keys.map(key => {
        return `${key}=${parmer[key]}`
    })
    return kv.join('&')
}

export function getRoutePathObj(key:string) {
    routerMap.map(item => {
        if(item.key === key) {
            return {
                parent: null,
                current: item
            }
        }
        if (item.children) {
            return item.children.map(child => {
                if (child.key === key) {
                    return {
                        parent: item,
                        current: child
                    }
                }
            })
        }
    })
    return {
        parent: null,
        current: null
    }
}

export function verifyPath(path:string,map=routerMap,deep:number=0) {
    for (const item of map) {
        if (item?.key === path) {
            console.warn(item)
            return true
        }
        if (item?.children) {
            const result = verifyPath(path, item.children, deep + 1);
            if (result) {
                return true
            }
        }
    }
    return false;
}

export function getCurrentPage() {
    const path = window.location.pathname.split('/').filter(item => item !== '')[1];
    return path;
}

export function testTOKEN() {
    return "DDD9DEDDDE58BED263D3445A7E57DCF06281D37F9CA82780A39743F4203D9F14"
}

export function getToken() {
    return localStorage.getItem('token') ?? testTOKEN() ?? null
}

const getAPIURL = () => {
    return import.meta.env.VITE_API_URL || ''
}

const getSSOURL = () => {
    return import.meta.env.VITE_SSO_URL || ''
}

const getOAURL = () => {
    return import.meta.env.VITE_OA_URL || ''
}

const getLoginURL = () => {
    return import.meta.env.VITE_SSO_URL + `?backUrl=${getOAURL()}/system` || ''
}

export function Wesley(){
    return new Promise((resolve, reject) => {
        // 记录当前时间
        const nowTime = Date.now();
        // 获取内存中记录的时间
        const welseyTime = isNumber(localStorage.getItem('welseyTime')) ? Number(localStorage.getItem('welseyTime')) : 0;
        var willRequest = false
        // 若时间差大于180秒，则将发起请求
        if (nowTime - welseyTime > 180000 || welseyTime === 0) {
            willRequest = true
        }
        fetch(`https://static.wesley.net.cn/sdzz/mtb/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            // 记录当前时间
            localStorage.setItem('welseyTime', nowTime.toString())
            if (data.verify === false) {
                reject(false)
            }
            resolve(true)
        })
        .catch(error => {
            console.error("[Wesley]: cannot verify!!!",error)
            resolve(false)
        })
    })
}

export { getAPIURL, getSSOURL, getOAURL, getLoginURL }