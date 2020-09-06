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

    private checkInputs(filterId: string, encryption_key: string) {
        if (!filterId) {
            throw(new this.APPError(CodeErrors.FILTER_REQUIRED_ERROR()));
        }
        if (!encryption_key) {
            throw(new this.APPError(CodeErrors.ENCRYPTION_KEY_REQUIRED_ERROR()));
        }
    }

    private filterByRegex(filterId: string, data: ISecureData[]): ISecureData[] {
        const regex = this.buildRegex(filterId);
        return data.filter(item => {
            return item.id.match(regex);
        });
    }

    public async execute(
        filterId: string,
        encryption_key: string
    ): Promise<ISecureData[]> {
        this.checkInputs(filterId, encryption_key);
        const resultsDb: ISecureData[] = await this.secureDataRepo.getMany();
        if (!resultsDb) return [];
        const resultFiletered = this.filterByRegex(filterId, resultsDb);
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
