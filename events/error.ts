import { Events } from "discord.js";
import { Event } from "../utils/structures";

export default class ErrorEvent extends Event<Events.Error> {
    name = Events.Error as const;
    execute(error: Error) {
        console.log(`Error name: ${error.name}\n- Message: ${error}\n- Stack: ${error.stack}`)
    }
    once = false
}