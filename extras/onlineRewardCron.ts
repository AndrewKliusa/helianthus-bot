import { Client } from "discord.js";
import Database from "../mongoose";
import RCON from "../rcon/rcon";
import { coinsForIngameActivity, coinsForIngameActivityCooldown, coinsForIngameActivityCheckFrequensy } from "../json/config.json"
import cron from 'node-cron';
import { UserModel } from '../schemas/userSchema';

async function giveOnlineRewards(client: Client) {
    const { response } = await RCON.sendMinecraftCommand("list");
    if (!response) return;

    const colonIndex = response.indexOf(":");
    if (colonIndex === -1) return;

    const playersList = response
        .slice(colonIndex + 1)
        .replace(/\n/g, "")
        .split(",")
        .map(username => username.trim())
        .filter(Boolean);
    if (playersList.length === 0) return;

    const playersUserDataPromises = playersList.map((playerUsername: string) => 
        Database.Users.getByFieldValue("minecraftUsername", playerUsername.replace(/[^A-Za-z0-9_]/g, ""))
    )
    const playerUserData = await Promise.all(playersUserDataPromises);

    let databaseUpdates = [];
    for (const userData of playerUserData) {
        if (!userData) continue;
        const playerCooldown = client.cooldowns.coinsForIngameActivity.get(userData.id);
        if (!playerCooldown || playerCooldown < Date.now()) {
            databaseUpdates.push(Database.Users.bulkIncrementByField(userData.id, "coins", coinsForIngameActivity))
            client.cooldowns.coinsForIngameActivity.set(userData.id, Date.now() + coinsForIngameActivityCooldown * 1000)
        }
    }

    await UserModel.bulkWrite(databaseUpdates);
}

export async function startOnlineRewardsCron(client: Client) {
    cron.schedule(`*/${coinsForIngameActivityCheckFrequensy}, * * * * *`, () => giveOnlineRewards(client));
} 