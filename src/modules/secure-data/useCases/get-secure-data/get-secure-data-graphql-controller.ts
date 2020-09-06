/* eslint-disable no-unused-vars */
import { ISecureData } from '../../domain/secure-data';
import { IGetSecurityDataArgs } from '../../http/graphql/dto/get-security-token-args';
import { ISecureDataResponse } from '../../http/graphql/dto/secure-data-response';
import { APPError } from '../../../../core/logic/errors';
import { CommonErrors } from '../../../../core/logic/CommonErrors';

class GetSecureDataGraphqlController {
    private useCase;

    constructor(useCase) {
        this.useCase = useCase;
    }

    public async getSecurityData(
        args: IGetSecurityDataArgs
    ) {
        try {
            // here transform to DTO - input
            const resultsUseCase: ISecureData[] = await this.useCase.execute(
                args.filterId,
                args.encryption_key);
            // here transform to DTO - output
            const resultDTO: ISecureDataResponse[] = resultsUseCase.map(item => {
                return {
                    id: item.id,
                    value: JSON.stringify(item.value),
                }
            });
            return resultDTO;
        } catch (err) {
            throw (!err.code) ? new APPError(CommonErrors.INTERNAL_SERVER_ERROR()) : err;
        }
    }
}

export { GetSecureDataGraphqlController };
