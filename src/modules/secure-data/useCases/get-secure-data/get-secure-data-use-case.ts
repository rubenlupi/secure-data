import { ISecureDataRepo } from "../../repos/secure-data";
import { IHashHelper } from "../../../../core/helpers/hash";
import { ICryptoHelper } from "../../../../core/helpers/crypto";
import { ISecureData } from "../../domain/secure-data";
import { CodeErrors } from "../../logic/CodeErrors";

// eslint-disable-next-line no-unused-vars
class GetSecureDataUseCase {
    private secureDataRepo: ISecureDataRepo;
    private hashHelper: IHashHelper;
    private cryptoHelper: ICryptoHelper;
    private APPError: any;

    constructor (
        secureDataRepo: ISecureDataRepo,
        hashHelper: IHashHelper,
        cryptoHelper: ICryptoHelper,
        APPError,
    ) {
        this.secureDataRepo = secureDataRepo;
        this.hashHelper = hashHelper;
        this.cryptoHelper = cryptoHelper;
        this.APPError = APPError;
    }

    private buildRegex(regexRule) {
        try {
            return new RegExp(regexRule, 'g');
        } catch (err) {
            throw(new this.APPError(CodeErrors.FILTER_ERROR()));
        }
    }

    public async execute(
        filterId: string,
        encryption_key: string
    ): Promise<ISecureData[]> {
        const resultsDb: ISecureData[] = await this.secureDataRepo.getMany();
        if (!resultsDb) return [];
        if (!filterId) {
            throw(new this.APPError(CodeErrors.FILTER_REQUIRED_ERROR()));
        }
        const regex = this.buildRegex(filterId);
        const resultFiletered: ISecureData[] = resultsDb.filter(item => {
            return item.id.match(regex);
        });
        // match the encryption_key
	    const results = await Promise.all(resultFiletered.map(item => this.hashHelper.compare(
            encryption_key,
            item.encryption_key
        )));
	    const passwordMatchRegs: ISecureData[] = resultFiletered.filter((_v, index) => results[index]);
        // There are results but the password does not match with any of them
        if (passwordMatchRegs.length === 0 && resultFiletered.length > 0) {
            // tslint:disable-next-line: no-unused-expression
            new this.APPError(CodeErrors.PASSWORD_NOT_MATCH(filterId));
            return [];
        }
        // decrypt the value
        const result: ISecureData[] = passwordMatchRegs.map(regs => {
            const valueUncrypted = this.cryptoHelper.decrypt(regs.value, encryption_key);
            return {
                id: regs.id,
                encryption_key,
                value: JSON.parse(valueUncrypted),
            }
        });
        return result;
    }
}

export { GetSecureDataUseCase };
