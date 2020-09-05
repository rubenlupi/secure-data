import { ICryptoHelper } from "../../../../core/helpers/crypto";

class CryptoHelper implements ICryptoHelper {
    public encrypt(text: string, key: string): string {
        return text;
    }

    public decrypt(text: string, key: string): string {
        return text;
    }
}

export { CryptoHelper, ICryptoHelper };