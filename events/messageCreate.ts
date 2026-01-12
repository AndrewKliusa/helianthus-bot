import { Events, Message } from "discord.js";
import Database from "../mongoose";
import { coinsPerMessage, coinsPerMessageCooldown } from "../json/config.json"

export = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        const nextAllowed = message.client.cooldowns.coinsForMessages.get(message.author.id);
        if (!nextAllowed || Date.now() >= nextAllowed) {
            const userData = await Database.Users.get(message.author.id);
            userData.coins += coinsPerMessage;
            userData.save();
            message.client.cooldowns.coinsForMessages.set(
                message.author.id, Date.now() + coinsPerMessageCooldown * 1000
            )
        }
    }
}