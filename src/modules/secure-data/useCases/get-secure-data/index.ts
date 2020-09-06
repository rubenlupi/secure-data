import { GetSecureDataApiController } from './get-secure-data-api-controller';
import { GetSecureDataGraphqlController } from './get-secure-data-graphql-controller';
import { GetSecureDataUseCase } from './get-secure-data-use-case';
import { SecureDataRepo } from '../../repos/secure-data';
import { SecureData } from '../../models/secure-data';
import { HashHelper } from '../../../../core/helpers/hash';
import { CryptoHelper } from '../../../../core/helpers/crypto';
import { APPError } from "../../../../core/logic/errors";

class InitGet {
    public static getInitUseCase() {
        const repo = new SecureDataRepo(SecureData);
        const hashHelper = new HashHelper();
        const cryptoHelper = new CryptoHelper();
        
        const getSecureDataUseCase = new GetSecureDataUseCase(
            repo,
            hashHelper,
            cryptoHelper,
            APPError
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
        };
    }
}

export { InitGet };


