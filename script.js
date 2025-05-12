// 미래 가치 계산 함수 (단리, 복리, 연속복리 포함)
function calculateFutureValue() {
    const principal = parseFloat(document.getElementById('principal-fv').value);
    const annualRate = parseFloat(document.getElementById('rate-fv').value) / 100; // 연이율 (소수)
    const timeInYears = parseFloat(document.getElementById('time-fv').value); // 기간 (년)
    const frequency = document.getElementById('compound-frequency').value; // 복리 주기

    if (isNaN(principal) || isNaN(annualRate) || isNaN(timeInYears) || principal < 0 || annualRate < 0 || timeInYears < 0) {
        document.getElementById('future-value').textContent = '유효한 값을 입력하세요.';
        return;
    }

    let futureValue = 0;
    let periodRate = annualRate; // 기간 이율 (기본값: 연이율)
    let totalPeriods = timeInYears; // 총 기간 횟수 (기본값: 기간(년))
    let compoundingFrequency = 1; // 연간 복리 횟수 (기본값: 1 - 연 복리)


    switch (frequency) {
        case 'simple': // 단리 (교과서 50페이지)
            // S = A(1 + rn)
            futureValue = principal * (1 + annualRate * timeInYears);
            break;
        case 'annual': // 연 복리 (교과서 53페이지)
            // S = A(1 + r)^n  (여기서 r은 연이율, n은 기간(년))
            periodRate = annualRate;
            totalPeriods = timeInYears;
            futureValue = principal * Math.pow(1 + periodRate, totalPeriods);
            break;
        case 'semi-annual': // 반기 복리 (1년에 2번)
             // S = A(1 + r/m)^(m*n)  (교과서 53페이지 공식 적용)
            compoundingFrequency = 2;
            periodRate = annualRate / compoundingFrequency; // 반기 이율
            totalPeriods = timeInYears * compoundingFrequency; // 총 반기 횟수
            futureValue = principal * Math.pow(1 + periodRate, totalPeriods);
            break;
        case 'quarterly': // 분기 복리 (1년에 4번)
             // S = A(1 + r/m)^(m*n)  (교과서 53페이지 공식 적용)
            compoundingFrequency = 4;
            periodRate = annualRate / compoundingFrequency; // 분기 이율
            totalPeriods = timeInYears * compoundingFrequency; // 총 분기 횟수
            futureValue = principal * Math.pow(1 + periodRate, totalPeriods);
            break;
        case 'monthly': // 월 복리 (1년에 12번)
             // S = A(1 + r/m)^(m*n)  (교과서 53페이지 공식 적용)
            compoundingFrequency = 12;
            periodRate = annualRate / compoundingFrequency; // 월 이율
            totalPeriods = timeInYears * compoundingFrequency; // 총 월 횟수
            futureValue = principal * Math.pow(1 + periodRate, totalPeriods);
            break;
        case 'continuous': // 연속 복리 (교과서 63, 65페이지)
            // A = P * e^(R * n)  (교과서 표기법 사용)
            futureValue = principal * Math.exp(annualRate * timeInYears);
            break;
        default:
            document.getElementById('future-value').textContent = '잘못된 복리 주기 선택';
            return;
    }

    document.getElementById('future-value').textContent = futureValue.toFixed(2); // 소수점 둘째 자리까지 표시
}

// 현재 가치 계산 함수 (단리 할인, 복리 할인, 연속 복리 할인 포함)
function calculatePresentValue() {
    const futureValue = parseFloat(document.getElementById('future-value-pv').value);
    const annualRate = parseFloat(document.getElementById('rate-pv').value) / 100; // 연이율 (소수)
    const timeInYears = parseFloat(document.getElementById('time-pv').value); // 기간 (년)
    const discountMethod = document.getElementById('discount-method').value; // 할인 방식

    if (isNaN(futureValue) || isNaN(annualRate) || isNaN(timeInYears) || futureValue < 0 || annualRate < 0 || timeInYears < 0) {
        document.getElementById('present-value').textContent = '유효한 값을 입력하세요.';
        return;
    }

    let presentValue = 0;

    switch (discountMethod) {
        case 'simple': // 단리 할인 (교과서 57페이지)
            // A = S / (1 + rn)  또는 A = S * (1 + rn)^(-1)
            presentValue = futureValue / (1 + annualRate * timeInYears);
            break;
        case 'compound': // 복리 할인 (교과서 57페이지 - 연 복리 기준)
            // A = S * (1 + r)^(-n)  (여기서 r은 연이율, n은 기간(년))
            presentValue = futureValue * Math.pow(1 + annualRate, -timeInYears);
            break;
        case 'continuous': // 연속 복리 할인 (교과서 63, 65페이지 미래가치 공식에서 역산)
            // A = S * e^(-Rn)
            presentValue = futureValue * Math.exp(-annualRate * timeInYears);
            break;
        default:
            document.getElementById('present-value').textContent = '잘못된 할인 방식 선택';
            return;
    }

    document.getElementById('present-value').textContent = presentValue.toFixed(2); // 소수점 둘째 자리까지 표시
}

// ... (환율 관련 함수는 이전과 동일) ...

// 페이지 로드 시 초기 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    // 초기 계산 및 환율 정보 가져오기
    calculateFutureValue();
    calculatePresentValue();
    fetchExchangeRate();
});

// ... (이자 및 현재가치 계산 함수는 이전과 동일) ...
// ... (이자 및 현재가치 계산 함수는 이전과 동일) ...

// 환율 정보를 저장할 전역 변수 (API 응답 데이터)
let latestExchangeRatesData = null;

// 실시간 환율 시각화 함수 (한국수출입은행 API 활용)
async function fetchExchangeRate() {
    const targetCurrency = document.getElementById('target-currency').value;
    const currentRateSpan = document.getElementById('current-rate');
    const currentRateCurrencySpan = document.getElementById('current-rate-currency');
    const noteDisplay = document.getElementById('exchange-rate-note');
    const latestRatesTableBody = document.getElementById('latest-exchange-rates').querySelector('tbody');

    noteDisplay.textContent = '환율 정보를 가져오는 중...';
    currentRateSpan.textContent = '...';
    currentRateCurrencySpan.textContent = targetCurrency;
    latestRatesTableBody.innerHTML = '<tr><td colspan="5">데이터 로딩 중...</td></tr>'; // 테이블 초기화 메시지

    // 한국수출입은행 환율 API 엔드포인트
    const apiEndpoint = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=PttOxw7s9jtrnvAsujxONfsLX5dAlju1&data=AP01`;

    try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP 오류! 상태: ${response.status}, 메시지: ${errorText.substring(0, 100)}...`);
        }

        const data = await response.json();

        latestRatesTableBody.innerHTML = ''; // 로딩 메시지 제거

        // 응답 데이터를 전역 변수에 저장
        latestExchangeRatesData = data;

        // 응답 데이터 확인 및 처리
        if (Array.isArray(data) && data.length > 0) {
            let selectedCurrencyInfo = null;

            data.forEach(item => {
                 const deal_bas_r = parseFloat(item.deal_bas_r.replace(/,/g, '') || '0');
                 const ttb = parseFloat(item.ttb.replace(/,/g, '') || '0');
                 const tts = parseFloat(item.tts.replace(/,/g, '') || '0');

                 let displayUnit = 1;
                 let unitMatch = item.cur_unit.match(/\((\d+)\)/);
                 if (unitMatch && unitMatch[1]) {
                     displayUnit = parseInt(unitMatch[1]);
                 }

                const newRow = latestRatesTableBody.insertRow();
                newRow.insertCell().textContent = item.cur_unit;
                newRow.insertCell().textContent = item.cur_nm;
                newRow.insertCell().textContent = (deal_bas_r / displayUnit).toFixed(4);
                newRow.insertCell().textContent = ttb !== 0 ? (ttb / displayUnit).toFixed(4) : '-';
                newRow.insertCell().textContent = tts !== 0 ? (tts / displayUnit).toFixed(4) : '-';

                if (item.cur_unit === targetCurrency) {
                    selectedCurrencyInfo = {
                        unit: item.cur_unit,
                        name: item.cur_nm,
                        deal_bas_r: deal_bas_r,
                        ttb: ttb,
                        tts: tts,
                        displayUnit: displayUnit
                    };
                }
            });

            if (selectedCurrencyInfo !== null) {
                 const selectedRate = selectedCurrencyInfo.deal_bas_r / selectedCurrencyInfo.displayUnit;
                 currentRateSpan.textContent = selectedRate.toFixed(4);
                 noteDisplay.textContent = `(KRW 기준, ${selectedCurrencyInfo.displayUnit} ${selectedCurrencyInfo.unit} 당 ${selectedCurrencyInfo.deal_bas_r.toFixed(2)} KRW)`;
            } else {
                 currentRateSpan.textContent = '정보 없음';
                 noteDisplay.textContent = '선택한 통화의 환율 정보를 찾을 수 없습니다.';
            }

            // 환율 데이터 로드 성공 시 변환 계산기 초기화
            updateCurrencyConverterOptions(data); // 변환할 통화 드롭다운 업데이트 (선택 사항)
            document.getElementById('conversion-result').textContent = ''; // 이전 결과 초기화
            document.getElementById('conversion-note').textContent = ''; // 이전 노트 초기화


        } else {
            latestRatesTableBody.innerHTML = '<tr><td colspan="5">환율 데이터를 가져오는데 실패했습니다.</td></tr>';
            currentRateSpan.textContent = '데이터 오류';
            noteDisplay.textContent = 'API 응답 형식이 예상과 다릅니다. (배열이 아니거나 비어있음)';
            latestExchangeRatesData = null; // 데이터 로드 실패 시 전역 변수 초기화
        }


    } catch (error) {
        console.error('환율 정보를 가져오는 중 오류 발생:', error);
        latestRatesTableBody.innerHTML = '<tr><td colspan="5">데이터 로딩 중 오류 발생</td></tr>';
        currentRateSpan.textContent = '오류';
        noteDisplay.textContent = `환율 정보를 가져오는 중 오류 발생: ${error.message}`;
        latestExchangeRatesData = null; // 데이터 로드 실패 시 전역 변수 초기화
    }
}

// 원화 금액을 다른 통화로 변환하는 함수
function convertCurrency() {
    const krwAmount = parseFloat(document.getElementById('krw-amount').value);
    const targetCurrency = document.getElementById('convert-target-currency').value;
    const conversionResultSpan = document.getElementById('conversion-result');
    const conversionNoteSpan = document.getElementById('conversion-note');

    conversionResultSpan.textContent = '...';
    conversionNoteSpan.textContent = '';

    if (isNaN(krwAmount) || krwAmount < 0) {
        conversionResultSpan.textContent = '유효한 원화 금액을 입력하세요.';
        return;
    }

    if (!latestExchangeRatesData) {
        conversionResultSpan.textContent = '환율 데이터 로딩 중 또는 오류 발생';
        conversionNoteSpan.textContent = '최신 환율 정보를 먼저 가져와야 합니다.';
        return;
    }

    const targetInfo = latestExchangeRatesData.find(item => item.cur_unit === targetCurrency);

    if (targetInfo) {
        // 한국수출입은행 API는 1 단위 외국 통화당 KRW 가치를 제공합니다.
        // 원화 금액을 외국 통화로 변환하려면: 원화 금액 / (외국 통화 1 단위당 KRW 가치) * 외국 통화 표시 단위
        // 예: 10000 KRW를 USD로 변환 -> 10000 / (1 USD당 KRW) * 1
        // 예: 10000 KRW를 JPY로 변환 -> 10000 / (100 JPY당 KRW) * 100

        const deal_bas_r = parseFloat(targetInfo.deal_bas_r.replace(/,/g, '') || '0');
        let displayUnit = 1;
        let unitMatch = targetInfo.cur_unit.match(/\((\d+)\)/);
        if (unitMatch && unitMatch[1]) {
            displayUnit = parseInt(unitMatch[1]);
        }

        if (deal_bas_r !== 0) {
            // 원화 금액 / (외국 통화 표시 단위당 KRW 가치) * 외국 통화 표시 단위
            const convertedAmount = (krwAmount / deal_bas_r) * displayUnit;
            conversionResultSpan.textContent = convertedAmount.toFixed(4); // 소수점 넷째 자리까지 표시
            conversionNoteSpan.textContent = `(매매기준율 ${targetInfo.deal_bas_r} KRW / ${displayUnit} ${targetInfo.cur_unit} 적용)`;
        } else {
            conversionResultSpan.textContent = '환율 정보 오류';
            conversionNoteSpan.textContent = '선택한 통화의 매매기준율이 유효하지 않습니다.';
        }

    } else {
        conversionResultSpan.textContent = '통화 정보 없음';
        conversionNoteSpan.textContent = '선택한 통화의 환율 정보를 찾을 수 없습니다.';
    }
}

// 환율 데이터 로드 후 변환할 통화 드롭다운 업데이트 (선택 사항)
// API 응답에 포함된 통화 목록으로 드롭다운 옵션을 채웁니다.
function updateCurrencyConverterOptions(data) {
    const selectElement = document.getElementById('convert-target-currency');
    selectElement.innerHTML = ''; // 기존 옵션 제거

    if (Array.isArray(data)) {
        data.forEach(item => {
            // KRW는 변환 대상에서 제외
            if (item.cur_unit !== 'KRW') {
                const option = document.createElement('option');
                option.value = item.cur_unit;
                // 100 단위 통화는 표시 단위 포함하여 텍스트 설정
                let optionText = item.cur_nm;
                 let unitMatch = item.cur_unit.match(/\((\d+)\)/);
                 if (unitMatch && unitMatch[1]) {
                     optionText += ` (${unitMatch[1]} ${item.cur_unit})`;
                 } else {
                      optionText += ` (${item.cur_unit})`;
                 }
                option.textContent = optionText;
                selectElement.appendChild(option);
            }
        });
    }
}


// 페이지 로드 시 해당 페이지에 맞는 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'interest.html') {
        calculateFutureValue();
        calculatePresentValue();
    } else if (currentPage === 'exchange.html') {
        fetchExchangeRate(); // 환율 정보 가져오기
    } else if (currentPage === 'index.html') {
        // 메인 페이지는 특별히 실행할 JavaScript 함수 없음
    } else {
        console.log("알 수 없는 페이지입니다.");
    }
});
