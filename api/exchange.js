// /var/task/api/exchange.js 파일

// ESM에서는 require 대신 import를 사용합니다.
// Node.js 내장 모듈도 import로 불러올 수 있습니다.
import https from 'https';

// node-fetch도 ESM이므로 정적 import로 불러옵니다.
import fetch from 'node-fetch';

export default async (req, res) => {
  const apiEndpoint = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=PttOxw7s9jtrnvAsujxONfsLX5dAlju1&data=AP01`;

  // SSL 인증서 검증을 비활성화하는 Agent를 생성합니다.
  // !!! 보안 위험이 있으므로 운영 환경에서는 사용에 신중해야 합니다. !!!
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    // fetch 호출 시 agent 옵션을 추가합니다.
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
