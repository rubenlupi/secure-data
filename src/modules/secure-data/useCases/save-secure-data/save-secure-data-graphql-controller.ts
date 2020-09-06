/* eslint-disable no-unused-vars */
import { ISecureData } from '../../domain/secure-data';
import { APPError } from '../../../../core/logic/errors';
import { CommonErrors } from '../../../../core/logic/CommonErrors';

class SaveSecureDataGraphqlController {
    private useCase;

    constructor(useCase) {
        this.useCase = useCase;
    }

    public async saveSecurityData(data: ISecureData) {
        try {
            // here transform to DTO - input
            const { id, encryption_key, value } = data;
            const valueJson = JSON.parse(value);
            const result: ISecureData = await this.useCase.execute({
                id,
                encryption_key,
                value: valueJson,
            });
            // here transform to DTO - output
            return {
                id: result.id,
                encryption_key: result.encryption_key,
                value: JSON.stringify(value),
            };
        } catch (err) {
            throw (!err.code) ? new APPError(CommonErrors.INTERNAL_SERVER_ERROR()) : err;
        }
    }
}

export { SaveSecureDataGraphqlController };
