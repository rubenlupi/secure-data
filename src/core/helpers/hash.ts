
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS;

interface IHashHelper {
    set(obj: string): Promise<string>;
    compare(obj: string, hash: string): Promise<boolean>;
}

class HashHelper implements IHashHelper {
    public async set(obj: string): Promise<string> {
        // tslint:disable-next-line: radix
        return bcrypt.hash(obj, parseInt(saltRounds));
    }

    public async compare(obj: string, hash: string): Promise<boolean> {
        return bcrypt.compare(obj, hash);
    }
}

export { HashHelper, IHashHelper }