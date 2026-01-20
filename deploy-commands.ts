import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { clientId, guildId, token } from './json/config.json';
import fs from 'node:fs';
import path from 'node:path';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

const commandsFolderPath = path.join(__dirname, 'commands');
const commandsFolder = fs.readdirSync(commandsFolderPath);

for (const file of commandsFolder ) {
    const filePath = path.join(commandsFolderPath , file);

    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

const rest = new REST().setToken(token);

(async () => {
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
})();