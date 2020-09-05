import { CodeErrors } from "../logic/CodeErrors";

interface ISecureData {
    id: string;
    encryption_key: string;
    value: any;
}

class SecureData {
    private id: string;
    // tslint:disable-next-line: variable-name
    private encryption_key: string;
    private value: any;
    private APPError;

    constructor(APPError, data: ISecureData){
        this.id = data.id;
        this.encryption_key = data.encryption_key;
        this.value = data.value;
        this.APPError = APPError;
    }
    public validate () {
        if (!this.id) {
            throw(new this.APPError(CodeErrors.ID_REQUIRED_ERROR()));
        }
        if (!this.encryption_key) {
            throw(new this.APPError(CodeErrors.ENCRYPTION_KEY_REQUIRED_ERROR()));
        }
        if (!this.value) {
            throw(new this.APPError(CodeErrors.VALUE_REQUIRED_ERROR()));
        }
    }
}

export { SecureData, ISecureData };
