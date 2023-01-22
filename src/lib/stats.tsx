import { env } from "../env/server.mjs";

type BotStats = {
  guilds: number,
  users: number,
  linked_accounts: number
}

/*
 * Gets the lates bot stats
 */
export async function getBotStats(): Promise<BotStats> {
  // Fetch the data
  const res = await fetch(`${env.API_URL}/stats`, {
    next: {
      revalidate: 60 * 5
    }
  }).then((data) => data.json())
    .catch((err) => {
      console.error(err);
      return {};
    });

  // return stats
  return {
    guilds: parseInt(res.guilds),
    users: parseInt(res.users),
    linked_accounts: parseInt(res.linked_accounts),
  };
}
