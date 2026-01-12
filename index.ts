import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { token } from './json/config.json';
import path from 'path';
import { readdirSync } from 'fs';
import { connectDatabase } from './mongoose';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection(); 
client.interactions = new Collection(); 

client.once(Events.ClientReady, (readyClient: { user: { tag: string; }; }) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

async function main() {
	const commandsFolderPath = path.join(__dirname, 'commands');
	const commandsFolder = readdirSync(commandsFolderPath);

	for (const file of commandsFolder) {
		const filePath = path.join(commandsFolderPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}

	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
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