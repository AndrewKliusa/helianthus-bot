import mongoose from 'mongoose';
import { mongoUri } from './json/config.json'
import { UserType } from './types/UserType';
import { UserModel } from './schemas/userSchema';
import { ShopItemType } from './types/ShopItemType';
import { ShopItemModel } from './schemas/shopItemSchema';

export async function connectDatabase() {
    await mongoose.connect(mongoUri);
}

class Collection<T> {
    protected model;
    
    constructor (model: mongoose.Model<T>) {
        this.model = model;
    }

    async create(fields: Partial<T>) {
        return await this.model.create(fields);
    }

    async getByFieldValue<K extends keyof T>(fieldName: K, fieldValue: T[K]) {
        return this.model.findOne({[fieldName]: fieldValue});
    }

    bulkIncrementByField<K extends keyof T>(id: string, fieldName: K, fieldValue: T[K]) {
        return {
            updateOne: {
                filter: { id: id },
                update: { $inc: { [fieldName]: fieldValue } }
            }
        };
    }

    async getAll(): Promise<T[]> {
        return await this.model.find();
    }
}

class Users extends Collection<UserType> {
    constructor() {
        super(UserModel);
    }

    async get(id: string) {
        const userData = await this.model.findOne({ id: id });
        if (!userData) {
            return await this.create({ id: id});
        }
        return userData;
    }

    async set(id: string, fields: Partial<UserType>) {
        const userData = await this.get(id);
        Object.assign(userData, fields);
        await userData.save();
    }
}

class ShopItems extends Collection<ShopItemType> {
    constructor() {
        super(ShopItemModel);
    }

    async get(name: string) {
        const itemData = await this.model.findOne({ name: name });
        if (!itemData) {
            return await this.create({ name: name });
        }
        return itemData;
    }

    async set(name: string, fields: Partial<ShopItemType>) {
        const itemData = await this.get(name);
        Object.assign(itemData, fields);
        await itemData.save();
    }
}

export default class Database {
    static Users = new Users();
    static ShopItems = new ShopItems();
}