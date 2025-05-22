const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/xxx/yyy';

async function sendDiscord(message, embed) {
  const payload = embed ? { embeds: [embed] } : { content: message };
  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Discord webhook error:', text);
    }
  } catch (e) {
    console.error('Failed to send Discord notification:', e);
  }
}

app.post('/discord-notify', async (req, res) => {
  const { result, name, username } = req.body;

  if (!result || (!name && !username)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    if (result === 'สำเร็จ') {
      const embed = {
        title: `🎉 ${(name || username)} ได้อัพเกรดสำเร็จ!`,
        description: `ไอเท็มมีระดับสูงขึ้นเป็น "Warzone S.GOD+7"!!`,
        color: 0x00FF00,
        image: {
          url: "https://img5.pic.in.th/file/secure-sv1/image_2025-05-21_025140493-removebg-preview.png"
        },
        footer: { text: "ได้รับไอเท็ม Warzone S.GOD+7" },
        timestamp: new Date().toISOString(),
      };
      await sendDiscord(null, embed);

    } else if (result === 'ล้มเหลว') {
      await sendDiscord(`⚠️ ${(name || username)} ได้อัพเกรดปลอก TOPGM ล้มเหลว! ขอให้โชคดีครั้งหน้า`);

    } else if (result === 'แตก') {
      await sendDiscord(`💥 ${(name || username)} ได้อัพเกรดล้มเหลว! ไอเท็มปลอก TOPGM ถูกทำลาย`);

    } else {
      return res.status(400).json({ error: 'Unknown result value' });
    }

    res.json({ status: 'sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Discord notify service running on port ${PORT}`));
