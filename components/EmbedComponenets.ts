import { Colors, EmbedBuilder, GuildMember } from "discord.js";
import { HouseType } from "../types/HouseType";
import { UserType } from "../types/UserType";

export function errorEmbed(err: string) {
    return { embeds: [new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Error")
        .setDescription(err)
        .setTimestamp()]
    }
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

export function infoEmbed(userData: UserType, member: GuildMember, userHouse: HouseType) {
    const HouseColors: Record<HouseType, number> = {
        [HouseType.Adamant]: Colors.Blue,
        [HouseType.Theurgy]: Colors.Purple,
        [HouseType.Demeter]: Colors.Green,
        [HouseType.None]: Colors.White
    } as const;

    return new EmbedBuilder() 
        .setTitle(member.displayName)
        .setDescription(
            `**Coins: ${userData.coins}**\n`+
            `**Level: ${userData.level}**\n`+
            `**Exp: ${userData.exp}**\n`+
            `**House: ${userHouse}**`
        )
        .setColor(HouseColors[userHouse])
}