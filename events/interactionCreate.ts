import { Events, Interaction, InteractionType } from "discord.js";
import { errorEmbed } from "../components/EmbedComponents";
import { Event } from "../utils/structures";

export default class IntreactionCreateEvent extends Event<Events.InteractionCreate> {
    name = Events.InteractionCreate as const;
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) {
            if (interaction.type == InteractionType.MessageComponent || interaction.type == InteractionType.ModalSubmit) {
                const interactionHandle = interaction.client.dynamicInteractions.get(interaction.customId)
                    ?? interaction.client.staticInteractions.get(interaction.customId);
                if (interactionHandle) await interactionHandle(interaction);
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
    once = false
}