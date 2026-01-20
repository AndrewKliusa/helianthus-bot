import { Schema, model } from "mongoose";
import { UserType } from "../types/UserType";

const userSchema = new Schema<UserType>({
    id: { type: String, required: true },
    coins: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1} ,
    exp: { type: Number, required: true, default: 0 },
    minecraftUsername: { type: String, required: false, default: null },
})

export const UserModel = model<UserType>("User", userSchema);
