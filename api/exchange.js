// /var/task/api/exchange.js 파일

// 기존의 정적 import 줄을 제거합니다.
// import fetch from 'node-fetch'; // Node.js 환경에서 fetch 사용

export default async (req, res) => {
  // CommonJS 환경에서 ESM 모듈을 불러오기 위해 동적 import()를 사용합니다.
  // import()는 Promise를 반환하며, await를 사용하여 기다립니다.
  // node-fetch는 default export를 사용하므로 { default: fetch } 형태로 받습니다.
  const { default: fetch } = await import('node-fetch'); // <--- 이 줄이 변경되었습니다.

  const apiEndpoint = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=PttOxw7s9jtrnvAsujxONfsLX5dAlju1&data=AP01`;

  try {
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      const errorText = await response.text();
      // 클라이언트에게 HTTP 오류 상태 코드와 메시지를 전달
      res.status(response.status).send(`API 오류: ${response.status}, ${errorText.substring(0, 100)}...`);
      return;
    }

    const data = await response.json();
    // API 응답 데이터를 클라이언트에게 JSON 형태로 전달
    res.status(200).json(data);

  } catch (error) {
    console.error('Serverless Function 오류:', error);
    // 서버 내부 오류 발생 시 클라이언트에게 오류 메시지 전달
    res.status(500).send(`Serverless Function 오류 발생: ${error.message}`);
  }
};
