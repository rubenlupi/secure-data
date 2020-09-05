import { ISecureDataRepo } from "../../repos/secure-data";
import { ISecureData, SecureData } from "../../domain/secure-data";
import { IHashHelper } from "../../../../core/helpers/hash";
import { ICryptoHelper } from "../../../../core/helpers/crypto";

// eslint-disable-next-line no-unused-vars
class SaveSecureDataUseCase {
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

    public async execute(secureDataReq: ISecureData): Promise<ISecureData> {
        // validate entity
        const secureDataDomain = new SecureData(this.APPError, secureDataReq);
        secureDataDomain.validate();
        // hash the encryption_key
        const encryption_key = await this.hashHelper.set(secureDataReq.encryption_key);
        // encrypt the message with the password
        const value = this.cryptoHelper.encrypt(
            JSON.stringify(secureDataReq.value),
            secureDataReq.encryption_key,
        );
        const secureDataStore: ISecureData = {
            id: secureDataReq.id,
            encryption_key,
            value,
        };
        // insert or update logic
        const exists = await this.secureDataRepo.getOneById(secureDataReq.id);
        return !exists ?
            this.secureDataRepo.save(secureDataStore) :
            this.secureDataRepo.update(secureDataStore);
    }
}

export { SaveSecureDataUseCase };
