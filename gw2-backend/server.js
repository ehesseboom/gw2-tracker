const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/account", async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "API key is required" });
  }

  try {
    const accountRes = await fetch("https://api.guildwars2.com/v2/account", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!accountRes.ok) {
      return res
        .status(accountRes.status)
        .json({ error: "Failed to fetch account data" });
    }

    const accountData = await accountRes.json();

    const pvpRes = await fetch("https://api.guildwars2.com/v2/pvp/stats", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!pvpRes.ok) {
      return res
        .status(pvpRes.status)
        .json({ error: "Failed to fetch pvp data" });
    }

    const pvpData = await pvpRes.json();

    const masRes = await fetch(
      "https://api.guildwars2.com/v2/account/mastery/points",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!masRes.ok) {
      return res
        .status(masRes.status)
        .json({ error: "Failed to fetch mastery data" });
    }

    const masData = await masRes.json();

    const achievRes = await fetch(
      "https://api.guildwars2.com/v2/account/achievements",
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!achievRes.ok) {
      return res
        .status(achievRes.status)
        .json({ error: "Failed to fetch achievement data" });
    }

    const achievData = await achievRes.json();

    // NEW CODE

    // // Filter completed achievements by checking current >= max
    // const completedAchievements = achievData.filter(
    //   (ach) =>
    //     ach.current !== undefined &&
    //     ach.max !== undefined &&
    //     ach.current >= ach.max
    // );

    // // Helper: split array into chunks of given size
    // const chunkArray = (arr, size) =>
    //   Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    //     arr.slice(i * size, i * size + size)
    //   );

    // // Calculate permanent AP by fetching achievement details in chunks
    // let permanentAP = 0;
    // const idChunks = chunkArray(
    //   completedAchievements.map((ach) => ach.id),
    //   200
    // );

    // for (const chunk of idChunks) {
    //   const idsString = chunk.join(",");
    //   const response = await fetch(
    //     `https://api.guildwars2.com/v2/achievements?ids=${idsString}`,
    //     {
    //       headers: { Authorization: `Bearer ${apiKey}` },
    //     }
    //   );

    //   if (!response.ok) {
    //     console.error(
    //       `Failed to fetch achievement details chunk: ${await response.text()}`
    //     );
    //     continue;
    //   }

    //   const achievDetails = await response.json();

    //   for (const ach of achievDetails) {
    //     // Skip daily/monthly achievements
    //     if (
    //       ach.flags &&
    //       (ach.flags.includes("Daily") || ach.flags.includes("Monthly"))
    //     ) {
    //       continue;
    //     }
    //     // Defensive: skip if no tiers present
    //     if (!ach.tiers || ach.tiers.length === 0) continue;

    //     const tier = ach.tiers[ach.tiers.length - 1];
    //     permanentAP += tier.points;
    //   }
    // }

    // NEW CODE

    res.json({
      name: accountData.name,
      created: accountData.created,
      age: accountData.age,
      // daily_ap: accountData.daily_ap,
      // permanent_ap: permanentAP,
      masSpent: masData.totals,
      wvw_rank: accountData.wvw_rank,
      pvp_rank: pvpData.pvp_rank,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
