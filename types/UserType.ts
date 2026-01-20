import { Document } from "mongoose";

export interface UserType extends Document {
    id: string,
    coins: number,
    level: number,
    exp: number,
    minecraftUsername: string | null
}