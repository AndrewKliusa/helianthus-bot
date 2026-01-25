import { model, Schema } from "mongoose";
import { ShopItemType } from "../types/ShopItemType";

const shopItemSchema = new Schema<ShopItemType>({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 100 },
    description: { type: String, required: false, default: null },
    giveCommand: { type: String, required: false, default: null }
})

export const ShopItemModel = model<ShopItemType>("ShopItem", shopItemSchema);