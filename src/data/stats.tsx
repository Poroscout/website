export interface BotStats {
  guildCount: GuildCount;
  userCount: UserCount;
  interactionCount: InteractionCount;
  userInstalls: number;
}

export interface GuildCount {
  current: number;
  history: number[];
  discordEstimate: number;
}

export interface UserCount {
  current: number;
  history: number[];
}

export interface InteractionCount {
  current: number;
  history: number[];
}

export async function getBotStats(): Promise<BotStats> {
  return await fetch("https://api.poroscout.gg/bot/stats").then((res) =>
    res.json(),
  );
}
