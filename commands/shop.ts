import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { addShopItemButton } from '../components/ButtonComponents';
import { ingameShopEmbed, successEmbed } from '../components/EmbedComponents';
import { ingameShopAddModal } from '../components/ModalComponents';
import Database from '../mongoose';
import { HouseType } from '../types/HouseType';
import { ShopType } from '../types/ShopType';
import { Command } from "../utils/structures";

export default class ShopCommand extends Command {
    data = new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Displays different shops')
        .addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
            .setName("send")
            .setDescription("Sends shops embeds")
                .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName("ingame")
                .setDescription("Sends in-game items shop"))
        )
        .addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
            .setName("edit")
            .setDescription("Edits different shops")
                .addSubcommand(new SlashCommandSubcommandBuilder()
                .setName("ingame")
                .setDescription("Edits in-game items shop"))
        )

    async execute(interaction: ChatInputCommandInteraction) {
        const subCommandGroup = interaction.options.getSubcommandGroup()
        const subCommand = interaction.options.getSubcommand();

        const itemsData = await Database.ShopItems.getAll();

        if (subCommandGroup == "send" && subCommand == "ingame") {

        }

        if (subCommandGroup == "edit" && subCommand == "ingame") {
            await interaction.reply({ embeds: [ingameShopEmbed(itemsData)], flags: [MessageFlags.Ephemeral], components: [addShopItemButton(ShopType.Ingame)] });
        }
    }

    static async handleAddIngameShopButton(interaction: ButtonInteraction) {
        await interaction.showModal(ingameShopAddModal());
    }

    static async handleIngameShopAddModal(interaction: ModalSubmitInteraction) {
        const name = interaction.fields.getTextInputValue('nameInput');
        const description = interaction.fields.getTextInputValue('descriptionInput');
        const command = interaction.fields.getTextInputValue('commandInput');
        const house = interaction.fields.getStringSelectValues('houseSelectInput')[0]

        await Database.ShopItems.create({
            name: name,
            description: description,
            command: command,
            houseType: house as HouseType,
            shopType: ShopType.Ingame
        });

        await interaction.reply(successEmbed(`Item \`${name}\` has been added to the in-game shop successfully.`));
    }

    static staticInteractions = {
        addIngameShopItemButton: this.handleAddIngameShopButton,
        ingameShopAddModal: this.handleIngameShopAddModal
    }
}