// @ https://stackoverflow.com/users/1235935/saptarshi-basu
import * as crypto from "crypto";

interface ICryptoHelper {
    encrypt(messagetext: string, key: string): string;
    decrypt(ciphertext: string, key: string): string;
}

class CryptoHelper implements ICryptoHelper {
    private ALGORITHM = {

        /**
         * GCM is an authenticated encryption mode that
         * not only provides confidentiality but also
         * provides integrity in a secured way
         */
        BLOCK_CIPHER: 'aes-256-gcm' as crypto.CipherCCMTypes,
    }

    public encrypt(text: string, key: string): string {
        const cipher = crypto.createCipher(this.ALGORITHM.BLOCK_CIPHER, key)
        let crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    public decrypt(text: string, key: string): string {
        const decipher = crypto.createDecipher(this.ALGORITHM.BLOCK_CIPHER, key)
        return decipher.update(text,'hex','utf8')
    }
}

export { CryptoHelper, ICryptoHelper };