const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 4000; // แยก port เป็น 4000 หรืออะไรก็ได้ที่ว่าง
const webhookURL = process.env.DISCORD_WEBHOOK_URL; // ใส่ webhook URL ใน env

app.use(cors());
app.use(express.json());

app.post('/notify', async (req, res) => {
  const { username, result, item } = req.body;

  if (!username || !result || !item) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบ' });
  }

  let content = '';
  let embed = null;

  if (result === 'success') {
    embed = {
      title: `🎉 ${username} อัพเกรดสำเร็จ!`,
      description: `ได้รับไอเท็มระดับสูง: ${item}`,
      color: 0x00ff00,
      timestamp: new Date().toISOString(),
    };
  } else if (result === 'fail') {
    content = `⚠️ ${username} อัพเกรดไม่สำเร็จสำหรับไอเท็ม ${item}`;
  } else if (result === 'broken') {
    content = `💥 ${username} ไอเท็ม ${item} ถูกทำลายระหว่างอัพเกรด!`;
  } else {
    content = `${username} มีผลลัพธ์ไม่รู้จัก: ${result}`;
  }

  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed ? { embeds: [embed] } : { content }),
    });

    res.json({ success: true, message: 'ส่งแจ้งเตือน Discord สำเร็จ' });
  } catch (err) {
    console.error('ส่ง Discord webhook ล้มเหลว:', err);
    res.status(500).json({ success: false, message: 'ส่งแจ้งเตือนไม่สำเร็จ' });
  }
});

app.listen(port, () => {
  console.log(`Discord notify server running at http://localhost:${port}`);
});
