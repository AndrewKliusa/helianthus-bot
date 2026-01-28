import { model, Schema } from "mongoose";
import { ShopItemType } from "../types/ShopItemType";
import { ShopType } from "../types/ShopType";
import { HouseType } from "../types/HouseType";

const shopItemSchema = new Schema<ShopItemType>({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 100 },
    description: { type: String, required: false, default: null },
    command: { type: String, required: false, default: null },
    shopType: { type: String, required: true, enum: Object.values(ShopType) },
    houseType: { type: String, required: true, enum: Object.values(HouseType) }
})

export const ShopItemModel = model<ShopItemType>("ShopItem", shopItemSchema);