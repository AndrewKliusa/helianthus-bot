import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import Database from '../mongoose';
import { leaderboardEmbed } from '../components/EmbedComponents';
import { Command } from "../utils/structures";

export default class LeaderboardCommand extends Command {
	data = new SlashCommandBuilder()
			.setName('leaderboard')
			.setDescription('Shows coins leaderboard.')

	async execute(interaction: ChatInputCommandInteraction) {
		const usersData = await Database.Users.getAll();
		await interaction.reply({ embeds: [leaderboardEmbed(usersData)], flags: MessageFlags.Ephemeral })
	}
}