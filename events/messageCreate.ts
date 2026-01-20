import { Events, Message } from "discord.js";
import Database from "../mongoose";
import { coinsPerMessage, coinsPerMessageCooldown } from "../json/config.json"
import { Event } from "../utils/structures";

export default class MessageCreateEvent extends Event<Events.MessageCreate> {
    name = Events.MessageCreate as const;
    async execute(message: Message) {
        const nextAllowed = message.client.cooldowns.coinsForMessages.get(message.author.id);
        if (!nextAllowed || Date.now() >= nextAllowed) {
            const userData = await Database.Users.get(message.author.id);
            userData.coins += coinsPerMessage;
            await userData.save();
            message.client.cooldowns.coinsForMessages.set(
                message.author.id, Date.now() + coinsPerMessageCooldown * 1000
            )
        }
    }
    once = false;
}