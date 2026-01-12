import { bold, Colors, EmbedBuilder, GuildMember, InteractionReplyOptions, MessageFlags } from "discord.js";
import { adamantRoleId, theurgyRoleId, demeterRoleId } from "../json/config.json"
import { HouseType } from "../types/HouseType";
import { UserType } from "../types/UserType";

export function errorEmbed(err: string) {
    return { embeds: [new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Error")
        .setDescription(bold(err))], flags: MessageFlags.Ephemeral
    } as InteractionReplyOptions
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
    const houseColors: Record<HouseType, number> = {
        [HouseType.Adamant]: Colors.Blue,
        [HouseType.Theurgy]: Colors.Purple,
        [HouseType.Demeter]: Colors.Orange,
        [HouseType.None]: Colors.White
    } as const;

    const houseMentions: Record<HouseType, string> = {
        [HouseType.Adamant]: `<@&${adamantRoleId}>`,
        [HouseType.Theurgy]: `<@&${theurgyRoleId}>`,
        [HouseType.Demeter]: `<@&${demeterRoleId}>`,
        [HouseType.None]: "None"
    } as const;

    return new EmbedBuilder() 
        .setTitle(`User: ${member.displayName}`)
        .setDescription(
            `**<:dollar:1460305222218809447> Coins: ${userData.coins}**\n`+
            `**<:star:1460305204669976679> Level: ${userData.level} (${userData.exp}/100)**\n`+
            `**<:house:1460305183442731169> House: ${houseMentions[userHouse]}**`
        )
        .setColor(houseColors[userHouse])
        .setThumbnail(member.user.avatarURL())
}