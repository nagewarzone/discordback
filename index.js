// backend.js
const express = require('express');
const fetch = require('node-fetch'); // ต้องติดตั้งด้วย npm install node-fetch@2
const app = express();
const PORT = process.env.PORT || 3000;

// Discord webhook URL ของคุณ
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1375109993766060163/hiyekifjjMItAEjaVv5xgrOmQg1nyyNdwQ0UJmE2wA_I3qQ6K3abWJcagz5kCiB4bxtw';

app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { action, username, password, name } = req.body;

  if (action !== 'upgrade') {
    return res.json({ success: false, message: 'รองรับเฉพาะ action "upgrade" เท่านั้น' });
  }

  // ตัวอย่างจำลองผลลัพธ์การอัพเกรด (สุ่ม 3 แบบ)
  const results = ['สำเร็จ', 'ล้มเหลว', 'แตก'];
  const result = results[Math.floor(Math.random() * results.length)];

  // สร้างข้อความแจ้งเตือนสำหรับ Discord
  let discordMessage = `**อัพเกรดไอเท็ม (Upgrade Item)**\n`;
  discordMessage += `ผู้เล่น: ${username}\n`;
  discordMessage += `ชื่อตัวละคร: ${name}\n`;
  discordMessage += `ผลลัพธ์: ${result}`;

  // ส่งแจ้งเตือน Discord webhook
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: discordMessage }),
    });
  } catch (error) {
    console.error('ส่งแจ้งเตือน Discord ไม่สำเร็จ:', error);
    // แต่ไม่ส่ง error กลับไปยัง client ให้ user ยังได้รับผลลัพธ์ปกติ
  }

  // ส่งผลลัพธ์กลับ client
  return res.json({ success: true, result });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
