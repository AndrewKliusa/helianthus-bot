import mongoose from 'mongoose';
import { UserModel } from './schemas/userSchema';
import { mongoUri } from './json/config.json'
import { UserType } from './types/UserType';

export async function connectDatabase() {
    await mongoose.connect(mongoUri);
}

export default class Database {
    public static Users = class {
        public static async create(id: string) {
            return await UserModel.create({
                id: id
            })
        }

        public static async get(id: string) {
            const userData = await UserModel.findOne({ id: id });
            if (!userData) {
                return await this.create(id);
            }
            return userData;
        }

        public static async set(id: string, fields: Partial<UserType>) {
            const userData = await this.get(id);
            Object.assign(userData, fields);
            userData.save();
        }
    }
}