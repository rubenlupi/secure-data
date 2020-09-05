import { SecureDataRepo } from "../mocks/SecureDataRepo";
import { CryptoHelper } from "../../../../core/helpers/crypto";
import { SaveSecureDataUseCase } from "../../useCases/save-secure-data/save-secure-data-use-case";
import { ISecureData } from "../../domain/secure-data";
import { APPError } from "../mocks/APPError";
import { CodeErrors } from "../../logic/CodeErrors";
import { HashHelper } from "../mocks/hash";

const hashHelper = new HashHelper({
    setResult: undefined,
    compareResult: undefined,
});
const cryptoHelper = new CryptoHelper();

const testDescription =
    '-It will save with the schema => id, encrypted_key and value.\n ' +
    '-This Schema is respresented by the interface ISecureData. \n' +
    '-It will return the same structure.\n ' +
    '-If the register exists (same id), it will update all, not verifying password.\n' +
    '-For security reasons, encrypted_key will be hashed.\n ' +
    '-For security reasons, value will be encrypted.\n ';

describe(testDescription, () => {
    describe('Test data integrity', () => {
        const secureData: ISecureData = {
            id: 'test',
            encryption_key: '1234',
            value: '{ "name": "test_name" }'
        };

        const repo = new SecureDataRepo({
            saveResponse: secureData,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: undefined },
        );

        const saveSecureDataUseCase = new SaveSecureDataUseCase(
            repo,
            hashHelper,
            cryptoHelper,
            APPError,
        );
        test('Check id from ISecureData throws error when it has no value', async () => {
            const secureDataNoId: ISecureData = {
                id: undefined,
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };
            try {
                await saveSecureDataUseCase.execute(secureDataNoId);
            } catch (err) {
                expect(err.detail).toBe(
                    CodeErrors.ID_REQUIRED_ERROR().detail);
            }
        });
        test('Check encrypted_key from ISecureData throws error when it has no value', async () => {
            const secureDataNoId: ISecureData = {
                id: '1234',
                encryption_key: undefined,
                value: '{ "name": "test_name" }'
            };
            try {
                await saveSecureDataUseCase.execute(secureDataNoId);
            } catch (err) {
                expect(err.detail).toBe(
                    CodeErrors.ENCRYPTION_KEY_REQUIRED_ERROR().detail);
            }
        });

        test('Check value from ISecureData throws error when it has no value', async () => {
            const secureDataNoId: ISecureData = {
                id: '1234',
                encryption_key: '1234',
                value: undefined
            };
            try {
                await saveSecureDataUseCase.execute(secureDataNoId);
            } catch (err) {
                expect(err.detail).toBe(
                    CodeErrors.VALUE_REQUIRED_ERROR().detail);
            }
        });
    });

    describe('Test response schema', () => {
        const secureData: ISecureData = {
            id: 'test',
            encryption_key: '1234',
            value: '{ "name": "test_name" }'
        };

        const repo = new SecureDataRepo({
            saveResponse: secureData,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: undefined },
        );

        test('check returned schema ISecureData', async () => {
            const saveSecureDataUseCase = new SaveSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await saveSecureDataUseCase.execute(secureData);
            expect(result.id).not.toBeUndefined();
            expect(result.encryption_key).not.toBeUndefined();
            expect(result.value).not.toBeUndefined();
        });

        test('Testing values missing. All values of ISecureData are requiered', async () => {
            // tslint:disable-next-line: no-shadowed-variable
            const repo = new SecureDataRepo({
                saveResponse: secureData,
                updateResponse: undefined,
                getOneByIdResponse: undefined,
                getManyResponse: undefined },
            );

            const saveSecureDataUseCase = new SaveSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await saveSecureDataUseCase.execute(secureData);
            expect(result.id).toBe(secureData.id);
            expect(result.encryption_key).toBe(secureData.encryption_key);
            expect(result.value).toBe(secureData.value);
        });

        test('Check values returned are the same that are stored', async () => {
            const saveSecureDataUseCase = new SaveSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await saveSecureDataUseCase.execute(secureData);
            expect(result.id).toBe(secureData.id);
            expect(result.encryption_key).toBe(secureData.encryption_key);
            expect(result.value).toBe(secureData.value);
        });
    });

    describe('Test security, hash and crypto', () => {
        const secureData: ISecureData = {
            id: 'test',
            encryption_key: '1234',
            value: '{ "name": "test_name" }'
        };

        const repo = new SecureDataRepo({
            saveResponse: undefined,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: undefined },
        );

        test('Check id and values are hashed and encrypted', async () => {
            const saveSecureDataUseCase = new SaveSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await saveSecureDataUseCase.execute(secureData);
            expect(result.id).toBe(secureData.id);
            expect(result.encryption_key).not.toBe(secureData.encryption_key);
            expect(result.value).not.toBe(secureData.value);
        });
    });

    describe('Insert/Update logic in the use case', () => {
        const secureData: ISecureData = {
            id: 'test',
            encryption_key: '1234',
            value: '{ "name": "test_name" }'
        };

        test('If the id exists, it will update it', async () => {
            // getOneById is returning a register so it will update it
            const repo = new SecureDataRepo({
                saveResponse: undefined,
                updateResponse: secureData,
                getOneByIdResponse: secureData,
                getManyResponse: undefined },
            );

            const saveSecureDataUseCase = new SaveSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await saveSecureDataUseCase.execute(secureData);
            expect(result.id).toBe(secureData.id);
            expect(result.encryption_key).toBe(secureData.encryption_key);
        });

        test('If the id does not exist, it will save it', async () => {
            // getOneById is not returning any register so it will create a new one
            const repo = new SecureDataRepo({
                saveResponse: secureData,
                updateResponse: undefined,
                getOneByIdResponse: undefined,
                getManyResponse: undefined },
            );

            const saveSecureDataUseCase = new SaveSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await saveSecureDataUseCase.execute(secureData);
            expect(result.id).toBe(secureData.id);
            expect(result.encryption_key).toBe(secureData.encryption_key);
        });
    });
});