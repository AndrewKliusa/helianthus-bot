import { Client, Events } from "discord.js";
import { Event } from "../utils/structures";

export default class ReadyEvent extends Event<Events.ClientReady> {
    name = Events.ClientReady as const;
    async execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    }
    once = true;
}