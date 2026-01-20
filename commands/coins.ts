import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { errorEmbed, successEmbed} from "../components/EmbedComponents";
import Database from '../mongoose';
import { Command } from "../utils/structures";

export default class CoinsCommand extends Command {
    data = new SlashCommandBuilder()
		.setName('coins')
		.setDescription('Manage user\'s coins')
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("add")
                .setDescription("Adds coins to the user")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setRequired(true)
                        .setDescription("User whose coins you want to manipulate")
                )
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setRequired(true)
                        .setDescription("Amount you want to be applied to user")
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("remove")
                .setDescription("Removes coins from the user")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setRequired(true)
                        .setDescription("User whose coins you want to manipulate")
                )
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setRequired(true)
                        .setDescription("Amount you want to be applied to user")
                )
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("set")
                .setDescription("Sets coins for the user")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setRequired(true)
                        .setDescription("User whose coins you want to manipulate")
                )
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setRequired(true)
                        .setDescription("Amount you want to be applied to user")
                )
        )
        .setDefaultMemberPermissions(5)

	async execute(interaction: ChatInputCommandInteraction) {
		const subCommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        if (!user) return await interaction.reply(errorEmbed("No user was provided."));
        if (!amount) return await interaction.reply(errorEmbed("No amount was provided."));
        if (user.bot) return await interaction.reply(errorEmbed("You can't add coins to a bot."));

        const userData = await Database.Users.get(user.id);

        if (subCommand == "add") {
            userData.coins += amount;
            await interaction.reply(successEmbed(`You have added ${amount} coins to ${user}.`))
        } else if (subCommand == "remove") {
            await interaction.reply(successEmbed(`You have removed ${amount} coins from ${user}.`))
            userData.coins -= amount;
        } else if (subCommand == "set") {
            await interaction.reply(successEmbed(`You have set ${user} coins to ${amount}.`))
            userData.coins = amount;
        }

        await userData.save();
	}
}