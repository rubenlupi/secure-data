import { IErrorLiteral } from "../../../../core/logic/CommonErrors";

class APPError extends Error {
    public code: number;
    public title: string;
    public detail: string;

    constructor(
        error: IErrorLiteral
    ) {
        const superMessage = (typeof error.detail !== 'string') ? JSON.stringify(error.detail) : error.detail;

        super(superMessage);

        this.code = error.code;
        this.detail = error.detail;
        this.title = error.title;
    }
}

export { APPError };