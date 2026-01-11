import { Colors, EmbedBuilder } from "discord.js";

export function errorEmbed(err: string) {
    return new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Error")
        .setDescription(err)
        .setTimestamp()
}

export function uptimeEmbed(uptime: number) {
    const uptimeSeconds = Math.round(uptime / 1000);
    const uptimeMinutes = Math.round(uptime / (1000 * 60));
    const uptimeHours = Math.round(uptime / (1000 * 60 * 60));
    const uptimeString = `${uptimeHours} hours ${uptimeMinutes} minutes ${uptimeSeconds} seconds`

    return new EmbedBuilder()
        .setColor(Colors.Orange)
        .setTitle(`Uptime: ${uptimeString}`)
}