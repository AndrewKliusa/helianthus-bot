import { randomInt } from 'crypto';
import { ChatInputCommandInteraction, MessageFlags, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, StringSelectMenuInteraction } from 'discord.js';
import { codeNotReceivedEmbed, codeSentEmbed, errorEmbed, linkedAccountEmbed, linkEmbed, successEmbed } from '../components/EmbedComponents';
import { codeInputModal, minecraftUsernameInputModal } from '../components/ModalComponents';
import { codeReceiveSelectMenu } from '../components/SelectMenuComponents';
import Database from '../mongoose';
import RCON, { rconResultMesssages } from '../rcon/rcon';
import { Command } from "../utils/structures";

export default class LinkCommand extends Command {
	data = new SlashCommandBuilder()
		.setName('link')
		.setDescription('Manage minecraft account linking system.')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('send_embed')
            .setDescription('Send account linking embed that will be available for everyone')
        )
        .setDefaultMemberPermissions(6);

	async execute(interaction: ChatInputCommandInteraction) {
		const subCommand = interaction.options.getSubcommand();
        if (subCommand == 'send_embed') {
            const interactionChannel = await interaction.channel?.fetch();

            if (!interactionChannel || !interactionChannel?.isSendable()) {
                return await interaction.reply(errorEmbed('Failed to send the message to the channel'));
            }

            await interactionChannel.send(linkEmbed());
            await interaction.reply(successEmbed('Message has been sent successfully!'));
        }
	}

    static async handleLinkSelectMenu(interaction: StringSelectMenuInteraction) {
        const selectedOption = interaction.values[0];
        const userData = await Database.Users.get(interaction.user.id);

        if (selectedOption == "link_create" && !userData.minecraftUsername) {
            return await interaction.showModal(minecraftUsernameInputModal());
        }
        
        if (selectedOption == "link_create" && userData.minecraftUsername) {
            return await interaction.reply(errorEmbed(`You already have an account with username \`${userData.minecraftUsername}\` linked to your discord account.`))
        }

        if (selectedOption == "deselect") {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            return interaction.deleteReply();
        } else if (!userData.minecraftUsername) return await interaction.reply(errorEmbed("You don't have a minecraft account linked to your discord."));

        if (selectedOption == "link_info") {
            return await interaction.reply({ embeds: [linkedAccountEmbed(userData.minecraftUsername)], flags: [MessageFlags.Ephemeral]} )
        }

        if (selectedOption == "link_removal") {
            const username = userData.minecraftUsername;
            userData.minecraftUsername = null;
            await userData.save();
            return await interaction.reply(successEmbed(`Link to minecraft account \`${username}\` has been removed.`))
        }
    }

    static async handleUsernameInputModal(interaction: ModalSubmitInteraction) {
        const minecraftUsername = interaction.fields.getTextInputValue('minecraftUsernameInput');
        const userData = await Database.Users.getByFieldValue("minecraftUsername", minecraftUsername);

        if (userData) return await interaction.reply(errorEmbed(`This minecraft account is already linked to this discord account: <@${userData.id}>.`))

        const code = randomInt(100000, 1000000);

        const tellraw = [
            { text: "Your linking code: ", color: "gold" },
            {
                text: "[ REVEAL CODE ]",
                color: "aqua",
                bold: true,
                underlined: true,
                hoverEvent: {
                action: "show_text",
                contents: [
                    { text: "🔐 Your Code:\n", color: "yellow" },
                    { text: code.toString(), color: "green", bold: true }
                ]
                }
            }
        ];

		const cmd = `/tellraw ${minecraftUsername} ${JSON.stringify(tellraw)}`;

        const { message, response } = await RCON.sendMinecraftCommand(cmd);
        if (message != rconResultMesssages.SuccessfullySentCommand) return await RCON.handleRconErrors(interaction, message, response);

        interaction.client.activeMinecraftCodes.set(interaction.user.id, { username: minecraftUsername, code: code});
        setTimeout(() => interaction.client.activeMinecraftCodes.delete(interaction.user.id), 600000)

        await interaction.reply({ embeds: [codeSentEmbed(minecraftUsername)], components: [codeReceiveSelectMenu()], flags: [MessageFlags.Ephemeral] });
    }

    static async codeReceiveSelectMenuHandler(interaction: StringSelectMenuInteraction) {
        const selectedOption = interaction.values[0];

        if (selectedOption == "deselect") {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            return await interaction.deleteReply();
        }

        if (selectedOption == "code_received") {
            return await interaction.showModal(codeInputModal());
        }

        if (selectedOption == "code_not_received") {
            return await interaction.reply({ embeds: [codeNotReceivedEmbed()], flags: [MessageFlags.Ephemeral] })
        }
    }

    static async codeInputModalHandler(interaction: ModalSubmitInteraction) {
        const enteredCode = interaction.fields.getTextInputValue("codeInput")
        const userLinkingData = interaction.client.activeMinecraftCodes.get(interaction.user.id);

        if (!userLinkingData) {
            return await interaction.reply(errorEmbed("It looks like your code has experied, because you didn't enter it in 10 minutes."))
        } 
        
        if (userLinkingData.code == Number(enteredCode)) {

            const userData = await Database.Users.get(interaction.user.id);
            userData.minecraftUsername = userLinkingData.username;
            await userData.save();

            interaction.client.activeMinecraftCodes.delete(interaction.user.id);

            const tellraw = [
                { text: "✔ ", color: "green", bold: true },
                { text: "Your account has been successfully linked!\n", color: "green" },
                {
                    text: `Linked to Discord: ${interaction.user.username}`,
                    color: "aqua",
                    hoverEvent: {
                    action: "show_text",
                    contents: [
                        { text: "Discord Account\n", color: "gray" },
                        { text: interaction.user.username, color: "gold", bold: true }
                    ]
                    }
                }
            ];

            await RCON.sendMinecraftCommand(`/tellraw ${userLinkingData.username} ${JSON.stringify(tellraw)}`);

            return await interaction.reply(successEmbed(`Your discord account has been linked with \`${userLinkingData.username}\` in-game account.`))
        } else if (userLinkingData.code != Number(enteredCode)) {
            return await interaction.reply(errorEmbed("The code you entered was incorrect! Please, try again."))
        }
    }

    static staticInteractions = {
        linkOptions: this.handleLinkSelectMenu,
        minecraftUsernameInputModal: this.handleUsernameInputModal,
        codeReceiveOptions: this.codeReceiveSelectMenuHandler,
        codeInputModal: this.codeInputModalHandler
    };
};