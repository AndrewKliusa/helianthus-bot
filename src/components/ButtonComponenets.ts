import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function refreshButton() {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("uptimeButton")
                .setLabel("Update")
                .setStyle(ButtonStyle.Success)
        )
}