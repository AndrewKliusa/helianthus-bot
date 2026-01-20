import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { errorEmbed, infoEmbed } from '../components/EmbedComponents';
import Database from '../mongoose';
import { getHouse } from '../utils/getHouse';
import { Command } from "../utils/structures";

export default class InfoCommand extends Command {
    data = new SlashCommandBuilder()
            .setName('info')
            .setDescription('Shows information about user')
                .addUserOption((option) => 
                    option
                        .setName("user")
                        .setDescription("User which information you want to get")
                        .setRequired(true)
                )

	async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user");
        if (!user) return await interaction.reply(errorEmbed("Failed to get user option from the command you entered."));

        const userData = await Database.Users.get(user?.id);
        const member = await interaction.guild?.members.fetch(user.id);
        if (!member) return await interaction.reply(errorEmbed("Provided user isn't member of the guild."));

        const userHouse = await getHouse(member);
		await interaction.reply({ embeds: [infoEmbed(userData, member, userHouse)], flags: MessageFlags.Ephemeral });
	}
}