import * as mongoose from 'mongoose';
import { ISecureData } from '../domain/secure-data';

export interface ISecureDataRepo {
    save(data: ISecureData): Promise<ISecureData>;
    update(data: ISecureData): Promise<ISecureData>;
    getOneById(data: unknown): Promise<ISecureData>;
    getMany(): Promise<ISecureData[]>;
}

export class SecureDataRepo implements ISecureDataRepo {
    private model: mongoose.Model<unknown>;

    constructor(model: mongoose.Model<unknown>) {
        this.model = model;
    }

    public async save(data: ISecureData): Promise<ISecureData> {
        const dataObj = new this.model(data);
        return dataObj.save();
    }

    public async update(data: ISecureData): Promise<ISecureData> {
        await this.model.updateOne({ id: data.id }, {
            $set: {
                value: data.value,
                encryption_key: data.encryption_key,
            }
        });
        return this.getOneById(data.id)
    }

    public async getOneById(id: string): Promise<ISecureData> {
        const result = await this.model.findOne({ id }).lean();
        if (!result) return result;
        delete result.__v;
        delete result._id;
        return result;
    }

    public async getMany(): Promise<ISecureData[]> {
        return this.model.find().lean();
    }
}
