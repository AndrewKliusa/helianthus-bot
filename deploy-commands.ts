import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { clientId, guildId, token } from './json/config.json';
import { CommandWithPossibleInteractions } from './utils/structures';

async function refreshCommands() {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    const commandsFolderPath = path.join(__dirname, 'commands');
    const commandsFolder = fs.readdirSync(commandsFolderPath);

    for (const file of commandsFolder ) {
        const filePath = path.join(commandsFolderPath, file);
        const imported = await import(filePath);
        const CommandClass = imported.default as CommandWithPossibleInteractions;
        const command = new CommandClass();

        commands.push(command.data.toJSON());
    }

    const rest = new REST().setToken(token);

    try {
        console.log(`Started refreshing ${commands.length} application commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        ) as any[];

        console.log(`Successfully reloaded ${data.length} application commands.`);
    } catch (error) {
        console.error(error);
    }
}

refreshCommands();