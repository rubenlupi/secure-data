import { CryptoHelper } from "../helpers/crypto";

describe('Core tests - Crypto', () => {
    it('crypto returns the value crypted', () => {
        const cryptoHelper = new CryptoHelper();
        const text = 'text';
        const pass = '123';
        const result = cryptoHelper.encrypt(text, pass);
        expect(result).not.toEqual(text);
    })
    
    it('crypto recovers the data', () => {
        const cryptoHelper = new CryptoHelper();
        const text = 'text';
        const pass = '123';
        const encryptedData = cryptoHelper.encrypt(text, pass);
        const decrpypt = cryptoHelper.decrypt(encryptedData, pass);
        expect(decrpypt).toEqual(text);
    })      
});
