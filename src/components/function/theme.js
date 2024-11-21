/**
 * 深色模式与浅色模式的切换
 * Copyright Wesley 2023
 * @description 因为useDark不好用所以自己写
 */
import Cookies from "js-cookie";

const tagName = "html"
let tagExample = null
const attribute = 'theme-mode'
const valueDark = 'dark'
const valueLight = 'light'
let isDark = null

//获取元素
function findDOM() {
    if (tagExample.length == 0) {
        console.log("切换样式失败：找不到挂载元素")
        return false
    }
    else {
        // 就算获取到多个元素，也只在第一个元素添加
        tagExample = tagExample[0]
        return true
    }
}

//获取当前状态
const themeMode = function (e = 0) {
    tagExample = document.getElementsByTagName(tagName)
    if (findDOM()) {
        let a = tagExample.getAttribute(attribute)
        if (a == valueDark || a == valueLight) {
            isDark = a == valueLight ? false : true
        }
        else {
            if (Cookies.get('theme') == valueDark || Cookies.get('theme') == valueLight) {
                isDark = Cookies.get('theme') == valueLight ? false : true
                tagExample.setAttribute(attribute, isDark ? valueDark : valueLight)
            }
            else {
                // 找不到设置为默认
                isDark = false
            }
        }
        return e == 1 ? true : isDark
    }
}

//添加属性
const toggleTheme = function () {
    if (themeMode(1)) {
        Cookies.set('theme', isDark ? valueLight : valueDark)
        tagExample.setAttribute(attribute, isDark ? valueLight : valueDark)
        console.log(`切换样式，当前为：${isDark ? "深色" : "浅色"}`)
    }
}

export { themeMode, toggleTheme }