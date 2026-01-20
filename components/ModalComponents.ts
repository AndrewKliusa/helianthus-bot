import { ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder } from "discord.js";

export function minecraftUsernameInputModal() {
    const modal = new ModalBuilder()
        .setCustomId("profileModal")
        .setTitle("Update your profile");

    const usernameInput = new TextInputBuilder()
        .setCustomId("minecraftUsernameInput")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const usernameInputLabel = new LabelBuilder()
        .setLabel("Your minecraft username")
        .setDescription('The username of your minecraft account')
        .setTextInputComponent(usernameInput);

    modal.addLabelComponents(usernameInputLabel);
    
    return modal;
}