import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ShopType } from "../types/ShopType";

export function refreshButton() {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("uptimeButton")
                .setLabel("Update")
                .setStyle(ButtonStyle.Success)
        )
}

export function addShopItemButton(type: ShopType) {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`add${type}ShopItemButton`)
                .setLabel("Add")
                .setStyle(ButtonStyle.Success)
        )
}