import { redisClient } from "../models"

export function generateRandomToken() {
    return `${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`
}

export function generateRandomString(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]

    return result
}


export function generateRandonNumbers(length: number) {
    const chars = '0123456789'

    let result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]

    return result
}

export function removeSpacesFromString(string: string) {
    return string.replace(/\s/g, '')
}

export async function generateVendorReference(count?: number) {
    // prefix with YYYTMMMDDD
    const newDate = new Date()
    const year = newDate.getFullYear().toString()
    let month = newDate.getMonth() + 1
    let day = newDate.getDate()
    let hour = newDate.getHours()
    let minute = newDate.getMinutes()
    let millisecond = newDate.getMilliseconds()

    // Convert to GMT+1
    hour += 1

    month = (month <= 9 ? `0${month}` : month) as number
    day = (day <= 9 ? `0${day}` : day) as number
    hour = (hour <= 9 ? `0${hour}` : hour) as number
    minute = (minute <= 9 ? `0${minute}` : minute) as number

    let ref = year + month + day + hour + minute + millisecond
    console.log({ ref })

    // Check if reference is in redis
    const key = 'vendor_reference:' + ref
    const exists_in_redis = await redisClient.get(key)
    if (exists_in_redis) {
        if (count && count > 4) {
            const randomThreeDigits = Math.floor(Math.random() * 900) + 100
            ref = ref + randomThreeDigits.toString()
        }
        // Add random 3digits to reference
        return generateVendorReference(count ?? 0 + 1)
    }

    // Check if reference
    return ref
}