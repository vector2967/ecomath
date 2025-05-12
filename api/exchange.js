    import fetch from 'node-fetch'; // Node.js 환경에서 fetch 사용

    export default async (req, res) => {
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
