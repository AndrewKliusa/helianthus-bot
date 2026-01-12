import { Events } from "discord.js";

export = {
    name: Events.Error,
    execute(error: Error) {
        console.log(`Error name: ${error.name}\n- Message: ${error}\n- Stack: ${error.stack}`)
    }
}