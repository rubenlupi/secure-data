/* eslint-disable no-unused-vars */
import { ISecureData } from '../../domain/secure-data';

class SaveSecureDataApiController {
    private useCase;

    constructor(useCase) {
        this.useCase = useCase;
    }

    public async saveSecurityToken(req, res: any, next) {
        try {
            // here transform to DTO - input
            const result: ISecureData = await this.useCase.execute(req.body);
            // here transform to DTO - output
            res.status(200).send(result);
        } catch (error) {
            error.code ? res.status(error.code).send(error) : next(error);
        }
    }
}

export { SaveSecureDataApiController };
