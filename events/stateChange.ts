import { Events, GuildMember, VoiceState } from "discord.js";
import { coinsForVoice, coinsForVoiceCooldown } from "../json/config.json"
import cron from 'node-cron';
import Database from "../mongoose";
import { getCronTask } from "../utils/getCronTask";
import { Event } from "../utils/structures";

export default class VoiceStateUpdateEvent extends Event<Events.VoiceStateUpdate> {
    name = Events.VoiceStateUpdate as const;
    async execute(oldState: VoiceState, newState: VoiceState) {
        if (!newState.member) return;

        const createTask = async (member: GuildMember) => {
            return cron.createTask(`*/${coinsForVoiceCooldown} * * * * *`, async () => {
                const nextAllowed = newState.client.cooldowns.coinsForVoice.get(member.id)
                if (!nextAllowed || Date.now() >= nextAllowed) {
                    const userData = await Database.Users.get(member.id);
                    userData.coins += coinsForVoice;
                    userData.save();
                    oldState.client.cooldowns.coinsForVoice.set(
                        member.id, Date.now() + coinsForVoiceCooldown * 1000
                    )
                }
            }, { name: "voiceCheck" + member.id });
        }

        if (!oldState.channel && newState.channel) {
            const existantTask = await getCronTask("voiceCheck" + newState.member.id);
            if (existantTask) {
                await existantTask.destroy();
            }

            const task = await createTask(newState.member);
            await task.start();
        }

        if (oldState.channel && !newState.channel) {
            const existantTask = await getCronTask("voiceCheck" + newState.member.id);
            if (existantTask) {
                await existantTask.destroy();
            }
        }

        if ((!oldState.mute && oldState.channel) && newState.mute) {
            const task = await getCronTask("voiceCheck" + newState.member.id);
            if (!task) await createTask(newState.member)
            else await task?.stop()
        }

        if (oldState.mute && !newState.mute) {
            const task = await getCronTask("voiceCheck" + newState.member.id);
            if (!task) {
                const task = await createTask(newState.member)
                await task.start()
            }
            await task?.start()
        }
    }
    once = false
}