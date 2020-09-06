import * as request from 'supertest';

import { appGraphql } from '../../../../app';
import { InitSave } from '../../useCases/save-secure-data';
import { CryptoHelper } from "../mocks/crypto";
import { HashHelper } from "../mocks/hash";
import { APPError } from "../mocks/APPError";
import { SecureDataRepo } from "../mocks/SecureDataRepo";
import { ISecureData } from '../../domain/secure-data';
import { SaveSecureDataUseCase } from '../../useCases/save-secure-data/save-secure-data-use-case';
import { SaveSecureDataApiController } from '../../useCases/save-secure-data/save-secure-data-api-controller';
import { SaveSecureDataGraphqlController } from '../../useCases/save-secure-data/save-secure-data-graphql-controller';
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

    
    describe('Test input data integrity', () => {    
        InitSave.getInitUseCase = jest.fn(() => mockFunction(repo, hashHelper));
    
        it('should respond an error when value is not filled', async () => {
            const value = JSON.stringify({ mock: "mock"});
            const query = `mutation {
                    setSecureData(id: "id_value", encryption_key: "ency")
                    { id, value }
            }`;
            const res = await request(appGraphql)
                .post('/secure-data')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(
                    JSON.stringify({ query })
                );
            expect(res.status).toBe(400);
            const jsonErrors = JSON.parse(res.error.text);
            expect(jsonErrors.errors).toEqual(        
                expect.arrayContaining([    
                    expect.objectContaining({ 
                        message: 'Field "setSecureData" argument "value" of type "String!" is required, but it was not provided.'
                  })
                ])
            )
        });

        it('should respond an error when encryption_key is not filled', async () => {
            const value = JSON.stringify({ mock: "mock"});
            const query = `mutation {
                    setSecureData(id: "id_value")
                    { id, value }
            }`;
            const res = await request(appGraphql)
                .post('/secure-data')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(
                    JSON.stringify({ query })
                );
            expect(res.status).toBe(400);
            const jsonErrors = JSON.parse(res.error.text);
            expect(jsonErrors.errors).toEqual(        
                expect.arrayContaining([    
                    expect.objectContaining({ 
                        message: 'Field "setSecureData" argument "encryption_key" of type "String!" is required, but it was not provided.'
                  })
                ])
            )
        });

        it('should respond an error when id is not filled', async () => {
            const value = JSON.stringify({ mock: "mock"});
            const query = `mutation {
                    setSecureData(encryption_key: "encryption_key")
                    { id, value }
            }`;
            const res = await request(appGraphql)
                .post('/secure-data')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(
                    JSON.stringify({ query })
                );
            expect(res.status).toBe(400);
            const jsonErrors = JSON.parse(res.error.text);
            expect(jsonErrors.errors).toEqual(        
                expect.arrayContaining([    
                    expect.objectContaining({ 
                        message: 'Field "setSecureData" argument "id" of type "String!" is required, but it was not provided.'
                  })
                ])
            )
        });

        it('should respond ok with all the fields are filled', async () => {
            const value = { mock: "mock" };
            const query = `mutation {
                    setSecureData(id: "id", encryption_key: "encryption_key", value: "${value}")
                    { id, value }
            }`;
            const res = await request(appGraphql)
                .post('/secure-data')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(
                    JSON.stringify({ query })
                );
            expect(res.status).toBe(200);
            console.log(res);
        });
    });

    describe('Handling internal server error', () => {
        it('handling internal server error as 200, json is not correct', async () => {        
            const value = { mock: "mock" };
            const query = `mutation {
                    setSecureData(id: "id", encryption_key: "encryption_key", value: "${value}")
                    { id, value }
            }`;
            const res = await request(appGraphql)
                .post('/secure-data')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(
                    JSON.stringify({ query })
                );
            const jsonErrors = JSON.parse(res.text);
            console.log(jsonErrors);
            expect(jsonErrors.errors).toEqual(        
                expect.arrayContaining([    
                    expect.objectContaining({ 
                        message: CommonErrors.INTERNAL_SERVER_ERROR().detail
                  })
                ])
            )
        });      
    }); 
});