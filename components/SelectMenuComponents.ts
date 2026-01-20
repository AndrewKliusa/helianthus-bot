import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export function linkSelectMenu() {
    const menu = new StringSelectMenuBuilder()
        .setCustomId('link_options')
        .setPlaceholder('Select option')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel('Link your account')
            .setDescription('Link your minecraft account with your discord.')
            .setValue('link_create')
            .setEmoji('1463145604359262405'),

            new StringSelectMenuOptionBuilder()
            .setLabel('Link information')
            .setDescription('Check what minecraft account is linked to your discord.')
            .setValue('link_info')
            .setEmoji('❓'),

            new StringSelectMenuOptionBuilder()
            .setLabel('Link removal')
            .setDescription('Remove linked minecraft account form your discord.')
            .setValue('link_removal')
            .setEmoji('🗑️')
    );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}
