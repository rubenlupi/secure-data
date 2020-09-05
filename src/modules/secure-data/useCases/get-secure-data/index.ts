import { GetSecureDataApiController } from './get-secure-data-api-controller';
import { GetSecureDataGraphqlController } from './get-secure-data-graphql-controller';
import { GetSecureDataUseCase } from './get-secure-data-use-case';
import { SecureDataRepo } from '../../repos/secure-data';
import { SecureData } from '../../models/secure-data';
import { HashHelper } from '../../../../core/helpers/hash';
import { CryptoHelper } from '../../../../core/helpers/crypto';
import { APPError } from "../../../../core/logic/errors";

const repo = new SecureDataRepo(SecureData);
const hashHelper = new HashHelper();
const cryptoHelper = new CryptoHelper();

const getSecureDataUseCase = new GetSecureDataUseCase(
    repo,
    hashHelper,
    cryptoHelper,
    APPError
);

const getSecurityTokenApiController = new GetSecureDataApiController(
    getSecureDataUseCase,
);

const getSecurityTokenGraphqlController = new GetSecureDataGraphqlController(
    getSecureDataUseCase,
);

export {
    getSecureDataUseCase,
    getSecurityTokenApiController,
    getSecurityTokenGraphqlController,
};
