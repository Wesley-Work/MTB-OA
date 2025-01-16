import { routerMap } from "../components/config";
import isNumber from 'lodash/isNumber';
import { RouteMaps, RouteMapItems } from "../types/type";

const applyParmer = (parmer:Object) => {
    const keys:string[] = Object.keys(parmer);
    const kv:string[] = keys.map(key => {
        return `${key}=${parmer[key]}`
    })
    return kv.join('&')
}

export function getRoutePathObj(map: RouteMaps=routerMap, value: string, deep: number = 0): { parent: RouteMapItems | null, current: RouteMapItems | null } {
    for (const item of map) {
        if (item?.key === value) {
            return {
                parent: null,
                current: item,
            };
        }
        if (item?.children) {
            const result = getRoutePathObj(item.children, value, deep + 1);
            if (result?.current) {
                return {
                    parent: result?.parent ?? item,
                    current: result.current
                };
            }
        }
    }
    return { parent: null, current: null };
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
    return "61E900CA624FE99D129E42F9CC5703334858D75635356591AA3AE866C0E8018B"
}

export function getToken() {
    return localStorage.getItem('token') ?? testTOKEN() ?? null
}

const getAPIURL = () => {
    return "https://oa-api.mtb.wesley.net.cn/v2"
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

export const taskType = [
    { label: "常规任务", value: 0, theme: "primary" },
    { label: "优先", value: 1, theme: "self", color: "rgb(177, 31, 38)" },
    { label: "加急", value: 2, theme: "warning" },
    { label: "暂缓（保留任务）", value: 3, theme: "default" }
];

export const taskStatus = [
    { label: "待办", value: 0, theme: "self", color: "rgb(177, 31, 38)" },
    { label: "统筹中", value: 1, theme: "self", color: "rgb(247, 199, 151)" },
    { label: "拍摄中", value: 2, theme: "self", color: "rgb(105, 158, 245)" },
    { label: "后期中", value: 3, theme: "self", color: "rgb(217, 113, 185)" },
    { label: "审核中", value: 4, theme: "warning" },
    { label: "进行中", value: 5, theme: "primary" },
    { label: "已完成", value: 6, theme: "success" },
    { label: "未知", value: 7, theme: "self", color: "rgb(250, 145, 152)" },
    { label: "暂缓", value: 8, theme: "default" }
];

export function findObjectByValueAndKeyInArray(arr: Array<any>, key: string, value: string | number): object | undefined {
    for (const obj of arr) {
        if (obj[key] === value) {
            return obj;
        }
    }
}

export { getAPIURL, getSSOURL, getOAURL, getLoginURL }