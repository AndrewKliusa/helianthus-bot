import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction, ClientEvents } from "discord.js";

export abstract class Command {
    abstract data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
    abstract execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}

export type CommandConstructor = new () => Command;

export type CommandWithPossibleInteractions = CommandConstructor & {
    staticInteractions?: Record<string, Function>;
}


export abstract class Event<K extends keyof ClientEvents = keyof ClientEvents> {
    abstract name: K;
    abstract once?: boolean;
    abstract execute(...args: ClientEvents[K]): Promise<void> | void;
}

export type EventConstructor = new () => Event;