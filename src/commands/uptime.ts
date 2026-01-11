import { ButtonInteraction, CommandInteraction, MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { uptimeEmbed } from "../components/EmbedComponenets";
import { refreshButton } from '../components/ButtonComponenets';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Shows bot uptime.'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply(
			{ 
				embeds: [uptimeEmbed(interaction.client.uptime)], 
				flags: MessageFlags.Ephemeral,
				components: [refreshButton()]
			}
		);

		interaction.client.interactions.set("uptimeButton", async (buttonInteraction: ButtonInteraction) => {
			interaction.editReply({ embeds: [ uptimeEmbed(interaction.client.uptime) ] })
			await buttonInteraction.deferUpdate();
		})
	},
};