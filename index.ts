import { Client, Collection, GatewayIntentBits, } from 'discord.js';
import { token } from './json/config.json';
import path from 'path';
import { readdirSync } from 'fs';
import { connectDatabase } from './mongoose';
import { ExtendedClientType } from './types/ExtendedClient';
import { Command, CommandWithPossibleInteractions, EventConstructor } from './utils/structures';

class ExtendedClient extends Client implements ExtendedClientType {
	commands = new Collection<string, Command>(); 
	dynamicInteractions = new Collection<string, Function>();
	staticInteractions = new Collection<string, Function>();
	cooldowns = {
		coinsForMessages: new Collection<string, number>,
		coinsForVoice: new Collection<string, number>
	}
}

const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

async function main() {
	const commandsFolderPath = path.join(__dirname, 'commands');
	const commandsFolder = readdirSync(commandsFolderPath);

	for (const file of commandsFolder) {
		const filePath = path.join(commandsFolderPath, file);
		const imported = await import(filePath);
		const CommandClass = imported.default as CommandWithPossibleInteractions;
		const command = new CommandClass();

		if (CommandClass.interactions) {
			for (const [id, handler] of Object.entries(CommandClass.interactions)) {
				client.staticInteractions.set(id, handler);
			}
		}

		client.commands.set(command.data.name, command);
	}

	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const imported = await import(filePath);
		const EventClass = imported.default as EventConstructor;
		const event = new EventClass();
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	await connectDatabase();
	await client.login(token);
}

main();