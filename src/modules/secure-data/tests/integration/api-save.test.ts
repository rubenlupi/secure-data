import * as request from 'supertest';

import { appAPI } from '../../../../../src/app';
import { InitSave } from '../../useCases/save-secure-data/';
import { CryptoHelper } from "../mocks/crypto";
import { HashHelper } from "../mocks/hash";
import { APPError } from "../mocks/APPError";
import { SecureDataRepo } from "../mocks/SecureDataRepo";
import { ISecureData } from '../../domain/secure-data';
import { SaveSecureDataUseCase } from '../../useCases/save-secure-data/save-secure-data-use-case';
import { SaveSecureDataApiController } from '../../useCases/save-secure-data/save-secure-data-api-controller';
import { SaveSecureDataGraphqlController } from '../../useCases/save-secure-data/save-secure-data-graphql-controller';
import { CodeErrors } from '../../logic/CodeErrors';
import { CommonErrors } from '../../../../core/logic/CommonErrors';

jest.setTimeout(90000);


const cryptoHelper = new CryptoHelper();

const mockFunction = (repo, hashHelper) => {
    const saveSecureDataUseCase = new SaveSecureDataUseCase(
        repo,
        hashHelper,
        cryptoHelper,
        APPError,
    );

    const createSecurityTokenApiController = new SaveSecureDataApiController(
        saveSecureDataUseCase,
    );
    
    const createSecurityTokenGraphqlController = new SaveSecureDataGraphqlController(
        saveSecureDataUseCase,
    );

    return {
        createSecurityTokenApiController,
        createSecurityTokenGraphqlController,
    }
}

describe('Integration tests - save secure data', () => {
    
    describe('Test input data integrity', () => {
        const hashHelper = new HashHelper({
            setResult: undefined,
            compareResult: undefined,
        });

        const secureData: ISecureData = {
            id: 'test',
            encryption_key: '1234',
            value: { "name": "test_name" }
        };
    
        const repo = new SecureDataRepo({
            saveResponse: secureData,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: undefined },
        );

        InitSave.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));
    
        it('should respond an error when id is not filled', async () => {
            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    encryption_key: 'password',
                    value: {
                        mock: 'random_value'
                    },
                });
            expect(res.error.status).toBe(400);
            expect(res.body).toEqual(CodeErrors.ID_REQUIRED_ERROR());
        });

        it('should respond an error when encryption_key is not filled', async () => {
            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    id: "my_id",
                    value: {
                        mock: 'random_value'
                    },
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(CodeErrors.ENCRYPTION_KEY_REQUIRED_ERROR());
        });

        it('should respond an error when value is not filled', async () => {
            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    id: "my_id",
                    encryption_key: 'password',
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(CodeErrors.VALUE_REQUIRED_ERROR());
        });

        it('should respond 200 when data is correct', async () => {
            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    id: "my_id",
                    encryption_key: 'password',
                    value: {
                        mock: 'random value',
                    },
                });
            expect(res.status).toBe(200);
        });
    });

    describe('Logic save/update', () => {
        it('should update when the item exists', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: undefined,
            });
    
            const secureDataSave: ISecureData = {
                id: 'testSave',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };

                
            const secureDataUpdate: ISecureData = {
                id: 'testUpdate',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };
        
            const repo = new SecureDataRepo({
                saveResponse: secureDataSave,
                updateResponse: secureDataUpdate,
                getOneByIdResponse: secureDataUpdate,
                getManyResponse: undefined },
            );

            InitSave.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));

            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    id: "my_id",
                    encryption_key: 'password',
                    value: {
                        mock: 'random value',
                    },
                });
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(secureDataUpdate.id);
            expect(res.body.id).not.toBe(secureDataSave.id);
        });

        it('should save when the item does not exist', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: undefined,
            });
    
            const secureDataSave: ISecureData = {
                id: 'testSave',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };

                
            const secureDataUpdate: ISecureData = {
                id: 'testUpdate',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };
        
            const repo = new SecureDataRepo({
                saveResponse: secureDataSave,
                updateResponse: secureDataUpdate,
                getOneByIdResponse: undefined,
                getManyResponse: undefined },
            );

            InitSave.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));

            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    id: "my_id",
                    encryption_key: 'password',
                    value: {
                        mock: 'random value',
                    },
                });
            expect(res.status).toBe(200);
            expect(res.body.id).not.toBe(secureDataUpdate.id);
            expect(res.body.id).toBe(secureDataSave.id);
        });        
    });    

    describe('Test DTO', () => {
        it('should update when the item exists', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: undefined,
            });
    
            const secureDataSave: ISecureData = {
                id: 'testSave',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };            
        
            const repo = new SecureDataRepo({
                saveResponse: secureDataSave,
                updateResponse: undefined,
                getOneByIdResponse: undefined,
                getManyResponse: undefined },
            );

            InitSave.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));

            const res = await request(appAPI)
                .post('/secure-data')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    id: "my_id",
                    encryption_key: 'password',
                    value: {
                        mock: 'random value',
                    },
                });
            expect(res.status).toBe(200);
            expect(res.body.id).not.toBeUndefined();
            expect(res.body.encryption_key).not.toBeUndefined();
            expect(res.body.value).not.toBeUndefined();
        });      
    }); 
    
});