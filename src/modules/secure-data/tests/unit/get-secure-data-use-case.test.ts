import { SecureDataRepo } from "../mocks/SecureDataRepo";
import { GetSecureDataUseCase } from "../../useCases/get-secure-data/get-secure-data-use-case";
import { ISecureData } from "../../domain/secure-data";
import { APPError } from "../mocks/APPError";
import { CodeErrors } from "../../logic/CodeErrors";
import { IGetSecurityTokenArgs } from "../../http/graphql/dto/get-security-token-args";
import { CryptoHelper } from "../mocks/crypto";
import { HashHelper } from "../mocks/hash";

const cryptoHelper = new CryptoHelper();

const testDescription =
    '-Perfom a query by id of the registers.\n ' +
    '-The query contains the key to decrypt the data. \n' +
    '-It will return the registers with this id and that contains the valid key.\n ' +
    '-If the encryption does not match any register ' +
    'it will log a message into the system.\n ';

describe(testDescription, () => {
    describe('Test data integrity', () => {
        const hashHelper = new HashHelper({
            setResult: undefined,
            compareResult: true,
        });
        const repo = new SecureDataRepo({
            saveResponse: undefined,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: undefined },
        );

        const getSecureDataUseCase = new GetSecureDataUseCase(
            repo,
            hashHelper,
            cryptoHelper,
            APPError,
        );
        test('Check filter from IGetSecurityTokenArgs throws error when it has no value', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: undefined,
                encryption_key: '1234'
            };
            try {
                await getSecureDataUseCase.execute(
                    getArgs.filterId, getArgs.encryption_key);
            } catch (err) {
                expect(err.detail).toBe(
                    CodeErrors.FILTER_REQUIRED_ERROR().detail);
            }
        });
        test('Check encryption_key from IGetSecurityTokenArgs throws error when it has no value', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: 'a',
                encryption_key: undefined
            };
            try {
                await getSecureDataUseCase.execute(
                    getArgs.filterId, getArgs.encryption_key);
            } catch (err) {
                expect(err.detail).toBe(
                    CodeErrors.ENCRYPTION_KEY_REQUIRED_ERROR().detail);
            }
        });
    });

    describe('Test response schema', () => {
        const secureData: ISecureData = {
            id: 'test',
            encryption_key: '1234',
            value: '1234'
        };

        const repo = new SecureDataRepo({
            saveResponse: secureData,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: [secureData] },
        );

        test('check returned schema ISecureData[]', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: 'test',
                encryption_key: '1234'
            };
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: true,
            });
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result[0].id).not.toBeUndefined();
            expect(result[0].encryption_key).not.toBeUndefined();
            expect(result[0].value).not.toBeUndefined();
        });
    });

    describe('Test filterId', () => {
        const secureDataA: ISecureData = {
            id: 'test-A',
            encryption_key: '1234',
            value: '1234'
        };

        const secureDataB: ISecureData = {
            id: 'test-B',
            encryption_key: '1234',
            value: '1234'
        };


        const secureDataC: ISecureData = {
            id: 'testFree',
            encryption_key: '1234',
            value: '1234'
        };

        const hashHelper = new HashHelper({
            setResult: undefined,
            compareResult: true,
        });

        const repo = new SecureDataRepo({
            saveResponse: undefined,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: [secureDataA, secureDataB, secureDataC] },
        );

        test('check all the registers that contains the string', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: 'test',
                encryption_key: '1234'
            };
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result).toHaveLength(3);
        });

        test('check all the registers that contains an specific string', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: '^testFree$',
                encryption_key: '1234'
            };
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result).toHaveLength(1);
        });


        test('check all the registers that starts by a string', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: '^test-',
                encryption_key: '1234'
            };
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result).toHaveLength(2);
        });

        test('check all the registers that start by a pattern - another options', async () => {
            const getArgs: IGetSecurityTokenArgs = {
                filterId: '^test*',
                encryption_key: '1234'
            };
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );

            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result).toHaveLength(3);
        });
    });


    describe('Test encryption logic', () => {
        const secureDataA: ISecureData = {
            id: 'test-A',
            encryption_key: '1234',
            value: '1234'
        };

        const repo = new SecureDataRepo({
            saveResponse: undefined,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: [secureDataA] },
        );
        test('If the encryption does not match it will no return any register', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: false,
            });
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );
            const getArgs: IGetSecurityTokenArgs = {
                filterId: 'test',
                encryption_key: '1234'
            };
            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result).toHaveLength(0);
        });

        test('If the encryption does not match it will return a register', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: true,
            });
            const getSecureDataUseCase = new GetSecureDataUseCase(
                repo,
                hashHelper,
                cryptoHelper,
                APPError,
            );
            const getArgs: IGetSecurityTokenArgs = {
                filterId: 'test',
                encryption_key: '1234'
            };
            const result = await getSecureDataUseCase.execute(
                getArgs.filterId, getArgs.encryption_key);
            expect(result).toHaveLength(1);
        });
    });
});