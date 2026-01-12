import cron from "node-cron"

export async function getCronTask(taskName: string) {
    return [...cron.getTasks()]
        .find(([_, task]) => task.name === taskName)?.[1] || null;
}