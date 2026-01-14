import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import Database from '../mongoose';
import { leaderboardEmbed } from '../components/EmbedComponenets';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows coins leaderboard.'),
	async execute(interaction: ChatInputCommandInteraction) {
        const usersData = await Database.Users.getAll();
		await interaction.reply({ embeds: [leaderboardEmbed(usersData)], flags: MessageFlags.Ephemeral })
	},
};