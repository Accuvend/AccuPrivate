import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { CRYPTO_IV, CRYPTO_PASSWORD } from './Constants';
import { generateRandomString } from './Helper';

class Cypher {
    private static cryptoIVHex = Buffer.from(CRYPTO_IV, 'hex')
    private static cryptoPasswordHex = Buffer.from(CRYPTO_PASSWORD, 'hex')
    private static cryptoAlgorithm = 'aes256'

    static hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compareSync(password, hash);
    }

    static encryptString(data: string): string {
        const cipher = crypto.createCipheriv(this.cryptoAlgorithm, this.cryptoPasswordHex, this.cryptoIVHex)
        let encryptedStr = cipher.update(JSON.stringify(data), 'utf8', 'hex')
        encryptedStr += cipher.final('hex')

        return encryptedStr
    }

    static decryptString(data: string): string {
        const decipher = crypto.createDecipheriv(this.cryptoAlgorithm, this.cryptoPasswordHex, this.cryptoIVHex)

        let decryptedStr = decipher.update(data, 'hex', 'utf8')
        decryptedStr += decipher.final('utf8')

        return decryptedStr.replace(/"/g, '')
    }

    static generateAPIKey(data: string, encryptionKey: string): string {
        const apiKey = Cypher.encryptString(data + ':' + encryptionKey)
        return apiKey
    }

    static decodeApiKey(key: string, encryptedKey: string): any {
        const secret = this.decryptString(encryptedKey)
        const apiKey = Cypher.decryptString(key)

        const [data, secretKey] = apiKey.split(':')
        const valid = secretKey === secret.split(':')[1]

        return valid ? data : null
    }
}

export {
    generateRandomString
}

export default Cypher;