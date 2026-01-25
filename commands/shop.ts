import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { refreshButton } from '../components/ButtonComponents';
import { Command } from "../utils/structures";

export default class ShopCommand extends Command {
	data = new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Displays different shops')
        .addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
            .setName("send")
            .setDescription("Sends shops embeds")
            .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName("ingame")
                .setDescription("Sends in-game items shop"))
        )
	async execute(interaction: ChatInputCommandInteraction) {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand == "ingame") {
            
        }
	}
}