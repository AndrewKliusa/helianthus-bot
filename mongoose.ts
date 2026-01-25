import mongoose from 'mongoose';
import { UserModel } from './schemas/userSchema';
import { mongoUri } from './json/config.json'
import { UserType } from './types/UserType';

export async function connectDatabase() {
    await mongoose.connect(mongoUri);
}

export default class Database {
    static Users = class {
        static async create(id: string) {
            return await UserModel.create({
                id: id
            })
        }

        static async get(id: string) {
            const userData = await UserModel.findOne({ id: id });
            if (!userData) {
                return await this.create(id);
            }
            return userData;
        }

        static async getByFieldValue<K extends keyof UserType>(fieldName: K, fieldValue: UserType[K]) {
            return await UserModel.findOne({ [fieldName]: fieldValue });
        }

        static async set(id: string, fields: Partial<UserType>) {
            const userData = await this.get(id);
            Object.assign(userData, fields);
            await userData.save();
        }

        static async getAll() {
            return await UserModel.find();
        }

        static bulkIncrementByField<K extends keyof UserType>(id: string, fieldName: K, fieldValue: UserType[K]) {
            return {
                updateOne: {
                    filter: { id: id },
                    update: { $inc: { [fieldName]: fieldValue } }
                }
            };
        }
    }
}