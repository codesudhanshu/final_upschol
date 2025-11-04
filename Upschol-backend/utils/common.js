// to generate URl
export const ToSeoUrl = (url) => {
    return url.toString().toLowerCase().replace(/\s+/g, ' ').trim().split(/\&+/).join("-and-").split(/[^a-z0-9]/).join("-").split(/-+/).join("-").trim('-').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}


export const generatePassword = () => {
    let length = 8, i = 0, retVal = "", charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",n = charset.length;
    for (i; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}