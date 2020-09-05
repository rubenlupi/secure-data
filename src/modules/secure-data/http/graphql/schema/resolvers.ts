import { createSecurityTokenGraphqlController } from "../../../useCases/save-secure-data";
import { IGetSecurityTokenArgs } from "../dto/get-security-token-args";
import { getSecurityTokenGraphqlController } from "../../../useCases/get-secure-data";
import { ISecureData } from "../../../domain/secure-data";

const resolvers = {
    setSecureData: async (args: ISecureData) => {
        return createSecurityTokenGraphqlController
            .saveSecurityToken(args)
    },

    getSecureData: async(args: IGetSecurityTokenArgs) => {
        return getSecurityTokenGraphqlController
            .getSecurityToken(args);
    }
}

export { resolvers };