import { Collection } from "discord.js";
import Command from "../structures/Command";
import { ExtendedClientType } from "../types/ExtendedClient";

declare module "discord.js" {
    interface Client extends ExtendedClientType {}
}