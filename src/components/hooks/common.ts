import { routerMap } from "../config";

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

const getAPIURL = () => {
    return import.meta.env.VITE_API_URL || ''
}

const getSSOURL = () => {
    return import.meta.env.VITE_SSO_URL || ''
}

const getOAURL = () => {
    return import.meta.env.VITE_OA_URL || ''
}

export { getAPIURL, getSSOURL, getOAURL }