import { AttachmentBuilder, bold, Colors, EmbedBuilder, GuildMember, InteractionReplyOptions, MessageCreateOptions, MessageFlags } from "discord.js";
import { adamantRoleId, demeterRoleId, theurgyRoleId } from "../json/config.json";
import { HouseType } from "../types/HouseType";
import { UserType } from "../types/UserType";
import { linkSelectMenu } from "./SelectMenuComponents";

export function errorEmbed(err: string) {
    return { embeds: [new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Error")
        .setDescription(bold(err))], flags: MessageFlags.Ephemeral
    } as InteractionReplyOptions
}

export function successEmbed(message: string) {
    return { embeds: [new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle("Success!")
        .setDescription(bold(message))], flags: MessageFlags.Ephemeral
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

export function leaderboardEmbed(usersData: UserType[]) {
    enum Icons {
        Gold = "<:gold:1460594644688572416>",
        Silver = "<:silver:1460594666981294091>",
        Bronze = "<:bronze:1460594690381320295>"
    }

    usersData.sort((userOne, userTwo) => {
        return userTwo.coins - userOne.coins;
    })

    const descriptionText = usersData.map((userData: UserType) => {
        const userPlacement = usersData.indexOf(userData) + 1;
        const userPlacementText = 
            userPlacement == 1 ? Icons.Gold : 
            userPlacement == 2 ? Icons.Silver : 
            userPlacement == 3 ? Icons.Bronze : `${userPlacement})`

        return `${userPlacementText} <@${userData.id}>: ${userData.coins} <:dollar:1460305222218809447>`
    }).join("\n");

    return new EmbedBuilder()
        .setTitle("Leaderboard")
        .setDescription(descriptionText)
}

export function linkEmbed(): MessageCreateOptions {
    const accountLink = new AttachmentBuilder('./assets/account_link.png');
    const solstice = new AttachmentBuilder('./assets/solstice.png');


    const embed = new EmbedBuilder()
        .setTitle("<:link1:1463145604359262405> Link your minecraft account")
        .addFields([
            { 
                name: 'Instructions',  
                value: 
                    '**1) Select the \"Link\" option under this message.**\n'+
                    '**2) Enter your minecraft username and press submit.**\n'+
                    '**3) Bot will send you an in-game message with the code. Enter that code into the form.**\n\n'+
                    '**By linking your minecraft account with discord, you will start earning coins for in-game activity.**'
            },
        ])
        .setColor(Colors.Orange)
        .setImage("attachment://account_link.png")
        .setThumbnail("attachment://solstice.png")

    return { embeds: [embed], files: [accountLink, solstice], components: [linkSelectMenu()] };
}