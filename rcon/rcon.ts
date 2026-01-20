import { Rcon } from "rcon-client";
import { host, port, password } from "../json/config.json"
import { ChatInputCommandInteraction, MessageComponentInteraction } from "discord.js";
import { runSafely } from "../utils/runSafely";
import { errorEmbed } from "../components/EmbedComponents";

enum rconCommandExecutionErrors {
    ProvidedPlayerNotFound = "No player was found"
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

    public static async handleRconErrors(interaction: MessageComponentInteraction | ChatInputCommandInteraction, errorMesssage: rconResultMesssages | rconCommandExecutionErrors) {
        if (errorMesssage == rconResultMesssages.ConnectionFailed) {
            await interaction.reply(errorEmbed("Couldn't send command to the server. Maybe the server is offline."));
        } else if (errorMesssage == rconResultMesssages.FailedToSendCommand) {
            await interaction.reply(errorEmbed("Failed to send command to the server."))
        } else if (errorMesssage == rconCommandExecutionErrors.ProvidedPlayerNotFound) {
            await interaction.reply(errorEmbed("The player username you provided isn't active on the server right now"))
        }
    }

    public static async sendMinecraftCommand(command: string): Promise<RconExecutionResult> {
        if (!this.connection?.authenticated) {
            this.connection = await runSafely(async () => new Rcon({ host, port, password }));
        }

        if (!this.connection) {
            return { message: rconResultMesssages.ConnectionFailed }
        }

        try {
            await this.connection!.connect();

            const response = await this.connection!.send(JSON.stringify(command));

            for (const value of Object.values(rconCommandExecutionErrors)) {
                if (response.includes(value)) {
                    return { message: value, response };
                }
            }
            console.log(`Server response: ${response}`);

            return { message: rconResultMesssages.SuccessfullySentCommand, response };
        } catch (error) {
            console.error("RCON Error:", error);
            return { message: rconResultMesssages.FailedToSendCommand }
        }
    }
}