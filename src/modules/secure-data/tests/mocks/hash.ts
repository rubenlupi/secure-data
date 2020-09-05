
import bcrypt from 'bcrypt';
const saltRounds = process.env.SALT_ROUNDS;


class HashHelper{
    private setResult: string;
    private compareResult: boolean;

    constructor( { setResult, compareResult } ) {
        this.setResult = setResult;
        this.compareResult = compareResult;
    }
    public async set(obj: string): Promise<string> {
        // tslint:disable-next-line: radix
        return `${obj}hashed`;
    }

    public async compare(obj: string, hash: string): Promise<boolean> {
        return this.compareResult;
    }
}

export { HashHelper }