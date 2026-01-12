import { GuildMember } from "discord.js";
import { HouseType } from "../types/HouseType";
import { adamantRoleId, theurgyRoleId, demeterRoleId } from "../json/config.json"

export async function getHouse(member: GuildMember): Promise<HouseType> {
    if (member.roles.cache.has(adamantRoleId)) return HouseType.Adamant;
    else if(member.roles.cache.has(theurgyRoleId)) return HouseType.Theurgy;
    else if (member.roles.cache.has(demeterRoleId)) return HouseType.Demeter;
    else return HouseType.None;
}