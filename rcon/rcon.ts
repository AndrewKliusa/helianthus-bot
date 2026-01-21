import { Rcon } from "rcon-client";
import { host, port, password } from "../json/config.json"
import { ChatInputCommandInteraction, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { runSafely } from "../utils/runSafely";
import { errorEmbed } from "../components/EmbedComponents";

enum rconCommandExecutionErrors {
    ProvidedPlayerNotFound = "No player was found",
    CommandIsWrong = "Unknown or incomplete command"
}

export enum rconResultMesssages {
    ConnectionFailed = "CONNECTION_FAILED",
    FailedToSendCommand = "FAILED_TO_SEND_COMMAND",
    SuccessfullySentCommand = "SUCCESSFULLY_SENT_COMMAND"
}

interface RconExecutionResult {
    message: rconResultMesssages | rconCommandExecutionErrors;
    response?: string;
}


export default class RCON {
    private static connection: Rcon | null = new Rcon({ host, port, password });

    public static async handleRconErrors(interaction: MessageComponentInteraction | ChatInputCommandInteraction | ModalSubmitInteraction, errorMesssage: rconResultMesssages | rconCommandExecutionErrors, response: string = "No response") {
        if (errorMesssage == rconResultMesssages.ConnectionFailed) {
            await interaction.reply(errorEmbed("Couldn't send command to the server. Maybe the server is offline."));
        } else if (errorMesssage == rconResultMesssages.FailedToSendCommand) {
            await interaction.reply(errorEmbed("Failed to send command to the server."))
        } else if (errorMesssage == rconCommandExecutionErrors.ProvidedPlayerNotFound) {
            await interaction.reply(errorEmbed("Player with username you provided isn't active on the server right now."))
        } else if (errorMesssage == rconCommandExecutionErrors.CommandIsWrong) {
            await interaction.reply(errorEmbed("Bot tried to execute a command but the syntax was incorrect. Message: " + response));
        }else {
            await interaction.reply(errorEmbed("Bot failed to execute a command on the server. Reason: " + response))
        }
    }

    public static async sendMinecraftCommand(command: string): Promise<RconExecutionResult> {
        if (!this.connection?.authenticated) {
            this.connection = await runSafely(async () => new Rcon({ host, port, password }));
            await this.connection!.connect();
        }

        if (!this.connection) {
            return { message: rconResultMesssages.ConnectionFailed }
        }

        try {
            const response = await this.connection!.send(command);

            for (const value of Object.values(rconCommandExecutionErrors)) {
                if (response.includes(value)) {
                    return { message: value, response };
                }
            }

            return { message: rconResultMesssages.SuccessfullySentCommand, response };
        } catch (error) {
            return { message: rconResultMesssages.FailedToSendCommand }
        }
    }
}