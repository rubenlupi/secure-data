import { IErrorLiteral } from "../../../core/logic/CommonErrors";

class CodeErrors {
    static ID_REQUIRED_ERROR(): IErrorLiteral {
        return {
            code: 400,
            detail: 'Id is a required field',
            title: 'ValidationError',
        };
    }

    static FILTER_REQUIRED_ERROR(): IErrorLiteral {
        return {
            code: 400,
            detail: 'Filter is a required field',
            title: 'ValidationError',
        };
    }

    static FILTER_ERROR(): IErrorLiteral {
        return {
            code: 400,
            detail: 'Filter is not correct',
            title: 'ValidationError',
        };
    }

    static VALUE_REQUIRED_ERROR(): IErrorLiteral {
        return {
            code: 400,
            detail: 'Value is a required field',
            title: 'ValidationError',
        };
    }

    static ENCRYPTION_KEY_REQUIRED_ERROR(): IErrorLiteral {
        return {
            code: 400,
            detail: 'Encryption key is a required field',
            title: 'ValidationError',
        };
    }

    static PASSWORD_NOT_MATCH(detail: string): IErrorLiteral {
        return {
            code: 400,
            detail,
            title: 'PASSWORD NOT MATCHING IN SECURE DATA',
        };
    }
}

export { CodeErrors };