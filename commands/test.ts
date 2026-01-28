import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { errorEmbed } from '../components/EmbedComponents';
import { Command } from "../utils/structures";

export default class InfoCommand extends Command {
    data = new SlashCommandBuilder()
            .setName('test')
            .setDescription('test')
                .addAttachmentOption((option) =>
                    option
                        .setName("file")
                        .setDescription("file to test")
                        .setRequired(true)
                );

	async execute(interaction: ChatInputCommandInteraction) {
        const file = interaction.options.getAttachment("file");
        if (!file) return await interaction.reply(errorEmbed("Failed to get file option from the command you entered."));
        await interaction.reply({ content: `File name: ${file.name}\nFile URL: ${file.url}`, flags: MessageFlags.Ephemeral });
	}
}