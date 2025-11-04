import axios from 'axios'

export const otpsent = async (body) => {
    const url = `https://sms.rozgar.com/otp-generator`;
    return (await axios.post(url, body).then((res) => {
        return res.data;
    }))
}

export const otpverify = async (body) => {
    const url = `https://sms.rozgar.com/check-OTP`;
    return (await axios.post(url, body).then((res) => {
        return res.data;
    }))
}