import * as request from 'supertest';

import { appAPI } from '../../../../app';
import { InitGet } from '../../useCases/get-secure-data';
import { CryptoHelper } from "../mocks/crypto";
import { HashHelper } from "../mocks/hash";
import { APPError } from "../mocks/APPError";
import { SecureDataRepo } from "../mocks/SecureDataRepo";
import { ISecureData } from '../../domain/secure-data';
import { GetSecureDataUseCase } from '../../useCases/get-secure-data/get-secure-data-use-case';
import { GetSecureDataApiController } from '../../useCases/get-secure-data/get-secure-data-api-controller';
import { GetSecureDataGraphqlController } from '../../useCases/get-secure-data/get-secure-data-graphql-controller';
import { CodeErrors } from '../../logic/CodeErrors';

jest.setTimeout(90000);


const cryptoHelper = new CryptoHelper();

const mockFunction = (repo, hashHelper) => {
    const getSecureDataUseCase = new GetSecureDataUseCase(
        repo,
        hashHelper,
        cryptoHelper,
        APPError,
    );

    const getSecurityDataApiController = new GetSecureDataApiController(
        getSecureDataUseCase,
    );
    
    const getSecurityDataGraphqlController = new GetSecureDataGraphqlController(
        getSecureDataUseCase,
    );

    return {
        getSecurityDataApiController,
        getSecurityDataGraphqlController,
    }
}

describe('Integration tests - get secure data', () => {
    
    describe('Test input data integrity', () => {
        const hashHelper = new HashHelper({
            setResult: undefined,
            compareResult: undefined,
        });

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

        InitGet.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));
    
        it('should respond an error when filterId is not filled', async () => {
            const res = await request(appAPI)
                .post('/secure-data/search')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    encryption_key: 'password',
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(CodeErrors.FILTER_REQUIRED_ERROR());
        });
        
        
        it('should respond an error when encryption_key is not filled', async () => {
            const res = await request(appAPI)
                .post('/secure-data/search')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    filterId: 'myFilter',
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(CodeErrors.ENCRYPTION_KEY_REQUIRED_ERROR());
        });
    });

    describe('Logic encryption key', () => {
        it('encryption not match, not return results and not throw error', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: false,
            });
    
            const secureDataGet: ISecureData = {
                id: 'testGet',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };

                
            const secureDataUpdate: ISecureData = {
                id: 'testUpdate',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };
        
            const repo = new SecureDataRepo({
                saveResponse: secureDataGet,
                updateResponse: undefined,
                getOneByIdResponse: undefined,
                getManyResponse: [secureDataGet] },
            );

            InitGet.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));

            const res = await request(appAPI)
                .post('/secure-data/search')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    filterId: 'testUpdate',
                    encryption_key: 'password',
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
        
        it('encryption match, return results', async () => {
            const hashHelper = new HashHelper({
                setResult: undefined,
                compareResult: true,
            });
    
            const secureDataGet: ISecureData = {
                id: 'testGet',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };

                
            const secureDataUpdate: ISecureData = {
                id: 'testUpdate',
                encryption_key: '1234',
                value: '{ "name": "test_name" }'
            };
        
            const repo = new SecureDataRepo({
                saveResponse: secureDataGet,
                updateResponse: undefined,
                getOneByIdResponse: undefined,
                getManyResponse: [secureDataGet] },
            );

            InitGet.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));

            const res = await request(appAPI)
                .post('/secure-data/search')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    filterId: 'testGet',
                    encryption_key: '1234',
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });   
    });
    
    describe('Logic - Filtering', () => {
        const hashHelper = new HashHelper({
            setResult: undefined,
            compareResult: true,
        });

        const secureDataGet: ISecureData = {
            id: 'testGet',
            encryption_key: '1234',
            value: '{ "name": "test_name" }'
        };
    
        const repo = new SecureDataRepo({
            saveResponse: secureDataGet,
            updateResponse: undefined,
            getOneByIdResponse: undefined,
            getManyResponse: [secureDataGet] },
        );

        InitGet.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));
        it('fitler not match, not return results and not throw error', async () => {        
            const res = await request(appAPI)
                .post('/secure-data/search')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    filterId: 'testUpdate',
                    encryption_key: 'password',
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
        });
        
        it('filter match, return results', async () => {        
            const res = await request(appAPI)
                .post('/secure-data/search')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    filterId: 'testGet',
                    encryption_key: '1234',
                });
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });   
    }); 
});
