// /var/task/api/exchange.js 파일

const https = require('https');

export default async (req, res) => {
  const { default: fetch } = await import('node-fetch');

  const apiEndpoint = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=PttOxw7s9jtrnvAsujxONfsLX5dAlju1&data=AP01`;

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const response = await fetch(apiEndpoint, { agent });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).send(`API 오류: ${response.status}, ${errorText.substring(0, 100)}...`);
      return;
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Serverless Function 오류:', error);
    res.status(500).send(`Serverless Function 오류 발생: ${error.message}, Code: ${error.code}`);
  }
};
