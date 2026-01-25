import { Collection } from "discord.js";
import { Command } from "../utils/structures";

export interface ExtendedClientType {
	commands: Collection<string, Command>;
	dynamicInteractions: Collection<string, Function>;
	staticInteractions: Collection<string, Function>;
	cooldowns: {
		coinsForMessages: Collection<string, number>;
		coinsForVoice: Collection<string, number>;
		coinsForIngameActivity: Collection<string, number>;
	},
	activeMinecraftCodes: Collection<string, { username: string, code: number }>;
}