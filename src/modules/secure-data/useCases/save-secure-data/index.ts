import { SaveSecureDataApiController } from './save-secure-data-api-controller';
import { SaveSecureDataGraphqlController } from './save-secure-data-graphql-controller'
import { SaveSecureDataUseCase } from './save-secure-data-use-case';
import { SecureDataRepo, ISecureDataRepo } from '../../repos/secure-data';
import { SecureData } from '../../models/secure-data';
import { HashHelper } from '../../../../core/helpers/hash';
import { CryptoHelper, ICryptoHelper } from '../../../../core/helpers/crypto';
import { APPError } from '../../../../core/logic/errors';

class InitSave {
    public static getInitUseCase() {
        const repo = new SecureDataRepo(SecureData);
        const hashHelper = new HashHelper();
        const cryptoHelper = new CryptoHelper();
        const saveSecureDataUseCase = new SaveSecureDataUseCase(
            repo,
            hashHelper,
            cryptoHelper,
            APPError,
        )

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
}


export { InitSave };
