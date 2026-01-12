import { Events, Interaction, InteractionType } from "discord.js";
import { errorEmbed } from "../components/EmbedComponenets";

export = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) {
            if (interaction.type == InteractionType.MessageComponent) {
                await interaction.client.interactions.get(interaction.customId)(interaction); 
            }
            return;
        };
        
	    const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorEmbed("There was an error while executing your command!"));
            } else {
                await interaction.reply(errorEmbed("There was an error while executing your command!"));
            }
        }
    }
}