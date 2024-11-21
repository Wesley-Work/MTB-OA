/**
 * 获取调用API接口前可能需要用到的数据
 * Copyright Wesley 2023. 
 * @allimport import * as api from "xxx";
 * @use api.xxx()
 * @moduleimport import { xxx , yyy } from "xxx";
 * @use xxx() or yyy()
 */

import {JSEncrypt} from 'jsencrypt'

const encrypt=new JSEncrypt();
const MD5 = require('md5.js')
const url = 'underfined'

/**
 * 获取API接口地址
 */

export function get_url (){
    // console.log('%cGet API Url:' + url, "color: #fff;padding: 2px 0px;font-family:'PingFang SC, Microsoft YaHei, Arial Regular';")
    console.log(url)
    return url
}

/**
 * 获取时间戳
 * @param {string} type "f"or"s" default is "s"
 * */
export function get_timestamp(type="s"){
    let timeex = new Date().getTime()
    if (type == "f"){
        return timeex
    }
    else{
        // 直接取整
        return parseInt(timeex/1000);
        // 四舍五入
        // return Math.round(timeex);
        // 向上取整
        // return Math.ceil(timeex);
        // 向下取整
        // return Math.floor(timeex);
    }
}

/**
 * 账号加密
 * @description 账号+公钥进行加密，私钥用来解密
 * PKCS#8
 * -----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYBxOAGgCiRKZ0od3lNn1gnHqd
mUbwzcB5qDOpocD7Uv6FP503VDmmtUvdaJRSm+kh5ixJ1d0BGtDI8oUkSt+J96+l
GTF1939ZiJzY/gnuuzxGcLAXhSMl8jQCeckH4z4UoUjo9V9cB8B3qkR6aE1G1qrX
dRtXFWoK5wFFGj/2EQIDAQAB
-----END PUBLIC KEY-----
 * -----BEGIN PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBANgHE4AaAKJEpnSh
3eU2fWCcep2ZRvDNwHmoM6mhwPtS/oU/nTdUOaa1S91olFKb6SHmLEnV3QEa0Mjy
hSRK34n3r6UZMXX3f1mInNj+Ce67PEZwsBeFIyXyNAJ5yQfjPhShSOj1X1wHwHeq
RHpoTUbWqtd1G1cVagrnAUUaP/YRAgMBAAECgYEA0EcyQ+XOCqUJn5WYbK/2fbkg
duYbAXw+QI0tEjWD7Ev+XNYSbA/mbZaKCHQV3Pe49BgJRz7Mj44dEkDQoUcW8RaJ
16EiLOAK0fx6iSJlW/oLdS2V6L0CFoNsXou3FCyoAbwj0iw+B2/gCMNw0joRUg2b
Pkv0VH2efE4NI60cVoECQQDy8n861bD3woZ1czfq3lErwJp4QlA4uJu3tKZfxJjt
94ZMfWzMkQYkbEYt11GCFzpjDpUk1RIahub4v9+dR/V5AkEA46JTfCA4WFysaO5w
GrRHuif2UePreZZfEMNeb1on+fNJj1lw9fE4cR5OLEnv5hNA7Ftg0ykjHARIPQLo
H+vXWQJBAIKe5tEXO4K6T9iuDg51YWcIswSdgsw8VVy8AAfVh/PJ9acCeJC0GH1U
yZa0AdrT6kx/9qhK9uTUSzLK1suVeOECQQCQy1VdVEVi93f3uwt2AQzK/dZx2o+T
JLJNwGgWXnulQzqcQ2FWH90uHv/Mri854y9d6PYa+0TI8nRc0reCborpAkBjUZLJ
HTQNNx92dnxKBJPARoZmLPyL2pJGjTxlYs5vTREtNQwXKUGyfqdE7NJ1aLDxorIi
HdIqNwMqVALmckFX
-----END PRIVATE KEY-----

 */

export function auth_encrypt(account,publickey=```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYBxOAGgCiRKZ0od3lNn1gnHqd
mUbwzcB5qDOpocD7Uv6FP503VDmmtUvdaJRSm+kh5ixJ1d0BGtDI8oUkSt+J96+l
GTF1939ZiJzY/gnuuzxGcLAXhSMl8jQCeckH4z4UoUjo9V9cB8B3qkR6aE1G1qrX
dRtXFWoK5wFFGj/2EQIDAQAB
-----END PUBLIC KEY-----```){
    let acc_md5 = new MD5().update(account).digest('hex')
    console.log('使用md5进行了加密：'+acc_md5)
    encrypt.setPublicKey(publickey);
    let encrypt_result=encrypt.encrypt(acc_md5);
    console.log('使用公钥进行了加密：'+encrypt_result)
    return encrypt_result
}


// export {auth_encrypt,get_url,get_timestamp}
