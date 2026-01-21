import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { refreshButton } from '../components/ButtonComponents';
import { uptimeEmbed } from "../components/EmbedComponents";
import { Command } from "../utils/structures";

export default class UptimeCommand extends Command {
	data = new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Shows bot uptime.')

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(
			{ 
				embeds: [uptimeEmbed(interaction.client.uptime)], 
				flags: MessageFlags.Ephemeral,
				components: [refreshButton()]
			}
		);

		interaction.client.dynamicInteractions.set("uptimeButton", async (buttonInteraction: ButtonInteraction) => {
			interaction.editReply({ embeds: [ uptimeEmbed(interaction.client.uptime) ] })
			await buttonInteraction.deferUpdate();
		});
	}
}