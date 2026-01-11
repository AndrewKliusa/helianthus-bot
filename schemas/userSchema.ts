import { Schema, model, Document } from "mongoose";

export type HouseType = "Adamant" | "Theurgy" | "Demeter";

export interface UserType extends Document {
    id: string,
    coins: number,
    level: number,
    exp: number,
    house?: HouseType
}

const userSchema = new Schema<UserType>({
    id: { type: String, required: true },
    coins: { type: Number, requied: true, default: 0 },
    level: { type: Number, required: true, default: 1} ,
    exp: { type: Number, required: true, default: 0 },
    house: { type: String, required: true, default: "None" }
})

export const UserModel = model<UserType>("User", userSchema);