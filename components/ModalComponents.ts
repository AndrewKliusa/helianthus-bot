import { ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder } from "discord.js";

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