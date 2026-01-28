import { HouseType } from "./HouseType";
import { ShopType } from "./ShopType";

export interface ShopItemType {
    name: string,
    price: number,
    shopType: ShopType,
    houseType: HouseType
    description?: string,
    command?: string,
}