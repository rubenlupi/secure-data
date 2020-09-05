interface IErrorLiteral {
    code: number;
    detail: string;
    title: string;
}

class CommonErrors {
    static INTERNAL_SERVER_ERROR(): IErrorLiteral {
        return {
            code: 500,
            detail: 'Internal server error.',
            title: 'InternalServerError',
        };
    }
}

export { CommonErrors, IErrorLiteral };