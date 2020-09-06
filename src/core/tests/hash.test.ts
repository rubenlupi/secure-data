import { HashHelper } from "../helpers/hash";

describe('Core tests - Crypto', () => {
    it('It hash the value', async () => {
        const hashHelper = new HashHelper();
        const pass = 'pass';
        const result = await hashHelper.set(pass);
        expect(result).not.toEqual(pass);
    })
    
    it('It return true when value matches', async () => {
        const hashHelper = new HashHelper();
        const pass = 'pass';
        const hashResult = await hashHelper.set(pass);
        const decrpypt = await hashHelper.compare(pass, hashResult);
        expect(decrpypt).toBeTruthy();
    })      

    it('It return false when value does not match', async () => {
        const hashHelper = new HashHelper();
        const pass = 'pass';
        const passWrong = 'pass-wrong';
        const encryptedData = await hashHelper.set(pass);
        const decrpypt = await hashHelper.compare(encryptedData, passWrong);
        expect(decrpypt).toBeFalsy();
    }) 
});