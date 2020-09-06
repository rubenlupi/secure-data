import { InitSave } from "../../../useCases/save-secure-data";
import { IGetSecurityDataArgs } from "../dto/get-security-token-args";
import { InitGet } from "../../../useCases/get-secure-data";
import { ISecureData } from "../../../domain/secure-data";

const resolvers = {
    setSecureData: async (args: ISecureData) => {
        return InitSave.getInitUseCase().createSecurityTokenGraphqlController
            .saveSecurityData(args)
    },

    getSecureData: async(args: IGetSecurityDataArgs) => {
        return InitGet.getInitUseCase().getSecurityDataGraphqlController
            .getSecurityData(args);
    }
}

export { resolvers };