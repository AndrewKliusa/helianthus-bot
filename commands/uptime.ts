import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { uptimeEmbed } from "../components/EmbedComponents";
import { refreshButton } from '../components/ButtonComponents';
import RCON, { rconResultMesssages } from '../rcon/rcon';
import { Command } from "../utils/structures";

export default class UptimeCommand extends Command {
	data = new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Shows bot uptime.')

	async execute(interaction: ChatInputCommandInteraction) {
		const tellraw = [
			{ text: "Your code for linking your Minecraft account: " },
			{
				textdfg: "Hover >>",
				color: "yellow",
				hoverEvent: {
				action: "show_text",
				contents: "123456"
				}
			}
		];

		const cmd = `/tellraw Stalono ${JSON.stringify(tellraw)}`;

		const { message, response } = await RCON.sendMinecraftCommand(cmd);
		if (message !== rconResultMesssages.SuccessfullySentCommand) {
			return await RCON.handleRconErrors(interaction, message);
		}
		console.log(message, response);

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