import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export function linkSelectMenu() {
    const menu = new StringSelectMenuBuilder()
        .setCustomId('linkOptions')
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
            .setEmoji('🗑️'),

            new StringSelectMenuOptionBuilder()
            .setLabel('Deselect')
            .setDescription('Deselect previously selected option.')
            .setValue('deselect')
            .setEmoji('🔄')
    );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

export function codeReceiveSelectMenu() {
    const menu = new StringSelectMenuBuilder()
        .setCustomId('codeReceiveOptions')
        .setPlaceholder('Select option')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel('I got the code')
            .setDescription('Press if you got the code.')
            .setValue('code_received')
            .setEmoji('✅'),

            new StringSelectMenuOptionBuilder()
            .setLabel('I didn\'t get the code')
            .setDescription('Check in-game chat again. If it\'s not there, press this.')
            .setValue('code_not_received')
            .setEmoji('❌'),

            new StringSelectMenuOptionBuilder()
            .setLabel('Deselect')
            .setDescription('Deselect previously selected option.')
            .setValue('deselect')
            .setEmoji('🔄')
    );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}
