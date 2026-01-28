import { LabelBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { HouseType } from "../types/HouseType";

export function minecraftUsernameInputModal() {
    const modal = new ModalBuilder()
        .setCustomId("minecraftUsernameInputModal")
        .setTitle("Link your minecraft account");

    const usernameInput = new TextInputBuilder()
        .setCustomId("minecraftUsernameInput")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const usernameInputLabel = new LabelBuilder()
        .setLabel("Your minecraft username:")
        .setTextInputComponent(usernameInput);

    modal.addLabelComponents(usernameInputLabel);
    
    return modal;
}

export function codeInputModal() {
     const modal = new ModalBuilder()
        .setCustomId("codeInputModal")
        .setTitle("Account linking");

    const codeInput = new TextInputBuilder()
        .setCustomId("codeInput")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("123456")
        .setRequired(true);

    const codeInputLabel = new LabelBuilder()
        .setLabel("Enter the code:")
        .setDescription('Bot has sent you the code inside your in-game chat.')
        .setTextInputComponent(codeInput);

    modal.addLabelComponents(codeInputLabel);
    
    return modal;
}

export function ingameShopAddModal() {
    const modal = new ModalBuilder()
        .setCustomId("ingameShopAddModal")
        .setTitle("In-game shop item add");

    const nameInput = new TextInputBuilder()
        .setCustomId("nameInput")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const descriptionInput = new TextInputBuilder()
        .setCustomId("descriptionInput")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const commandInput = new TextInputBuilder()
        .setCustomId("commandInput")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const nameInputLabel = new LabelBuilder()
        .setLabel("Item name: ")
        .setTextInputComponent(nameInput);

    const descriptionInputLabel = new LabelBuilder()
        .setLabel("Item description: ")
        .setTextInputComponent(descriptionInput);

    const commandInputLabel = new LabelBuilder()
        .setLabel("Give command: ")
        .setDescription("MAKE SURE TO INCLUDE {username} VARIABLE!!!! Like this: /give {username} minecraft:diamond 1")
        .setTextInputComponent(commandInput);

    const houseSelectOptions = Object.values(HouseType).map((houseType) =>{
        return new StringSelectMenuOptionBuilder()
            .setLabel(houseType)
            .setValue(houseType)
    })

    const houseSelect = new StringSelectMenuBuilder()
        .setCustomId('houseSelectInput')
        .setPlaceholder('Pick a house')
        .setRequired(true)
        .addOptions(houseSelectOptions);

    const houseSelectMenuLabel = new LabelBuilder()
        .setLabel("Select a house the item is for")
        .setDescription("Set to None to make it available for every house")
        .setStringSelectMenuComponent(houseSelect)

    modal.addLabelComponents(nameInputLabel, descriptionInputLabel, commandInputLabel, houseSelectMenuLabel);
    
    return modal;
}