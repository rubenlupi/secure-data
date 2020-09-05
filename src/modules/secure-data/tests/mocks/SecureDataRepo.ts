import { ISecureData } from "../../domain/secure-data";
import { ISecureDataRepo } from "../../repos/secure-data";

export class SecureDataRepo implements ISecureDataRepo {
    private saveResponse: ISecureData;
    private updateResponse: ISecureData;
    private getOneByIdResponse: ISecureData;
    private getManyResponse: ISecureData[];

    constructor({
        saveResponse,
        updateResponse,
        getOneByIdResponse,
        getManyResponse,
    }) {
        this.saveResponse = saveResponse;
        this.updateResponse = updateResponse;
        this.getOneByIdResponse = getOneByIdResponse;
        this.getManyResponse = getManyResponse
    }

    public async save(data: ISecureData): Promise<ISecureData> {
        return this.saveResponse || data;
    }

    public async update(data: ISecureData): Promise<ISecureData> {
        return this.updateResponse;
    }

    public async getOneById(id: string): Promise<ISecureData> {
        return this.getOneByIdResponse;
    }

    public async getMany(): Promise<ISecureData[]> {
        return this.getManyResponse;
    }
}
