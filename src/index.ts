import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { token } from '../json/config.json';
import path from 'path';
import { readdirSync } from 'fs';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient: { user: { tag: any; }; }) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection(); 
client.interactions = new Collection(); 

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

client.login(token);