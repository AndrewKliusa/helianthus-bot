import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, StringSelectMenuInteraction } from 'discord.js';
import { errorEmbed, linkEmbed, successEmbed } from '../components/EmbedComponents';
import Database from '../mongoose';
import { minecraftUsernameInputModal } from '../components/ModalComponents';
import { Command } from "../utils/structures";

export default class LinkCommand extends Command {
	data = new SlashCommandBuilder()
		.setName('link')
		.setDescription('Manage minecraft account linking system.')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('send_embed')
            .setDescription('Send account linking embed that will be available for everyone')
        )
        .setDefaultMemberPermissions(6);

	async execute(interaction: ChatInputCommandInteraction) {
		const subCommand = interaction.options.getSubcommand();
        if (subCommand == 'send_embed') {
            const interactionChannel = await interaction.channel?.fetch();

            if (!interactionChannel || !interactionChannel?.isSendable()) {
                return await interaction.reply(errorEmbed('Failed to send the message to the channel'));
            }

            await interactionChannel.send(linkEmbed());
            await interaction.reply(successEmbed('Message has been sent successfully!'));
        }
	}

    static async handleLinkCreateButton(interaction: StringSelectMenuInteraction) {
        const userData = await Database.Users.get(interaction.user.id);

        if (userData.minecraftUsername) {
            return await interaction.reply(errorEmbed(`You already have an account with username ${userData.minecraftUsername} linked to your discord account.`))
        }

        await interaction.showModal(minecraftUsernameInputModal());
    }

    static interactions = {
        link_options: this.handleLinkCreateButton
    };
};