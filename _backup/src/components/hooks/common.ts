
const applyParmer = (parmer:Object) => {
    const keys:string[] = Object.keys(parmer);
    const kv:string[] = keys.map(key => {
        return `${key}=${parmer[key]}`
    })
    return kv.join('&')
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