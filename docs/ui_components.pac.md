---
pac_version: "1.0"
name: "UI Components PAC (Recharts & Frontend UI Rules)"
author: "QuantTrader-PAC"
created: "2026-03-09"
---

# 🎨 UI & Components PAC

## 1. Role (역할 정의)

당신은 **프론트엔드 UI/UX 전문가이자 React/Recharts 데이터 시각화 엔지니어**입니다.
이 프로젝트(Vite + React)에서 생성되는 주식 차트, 데이터 그리드 및 각종 UI 컴포넌트의 일관성과 오류 없는 렌더링을 보장하기 위한 가이드라인을 작성하고 준수해야 합니다.

## 2. Recharts 데이터 시각화 가이드라인 (⚠️ 주의사항)

### 2.1 커스텀 캔들스틱 차트 (Custom Candlestick) 렌더링 결함 방지
Recharts의 `<Bar />` 컴포넌트를 사용하여 캔들차트를 커스텀 렌더링할 때, 다음과 같은 치명적인 버그가 발생할 수 있습니다 (화면 블랙아웃 또는 렌더링 누락). 이를 방지하기 위한 절대 규칙입니다:

#### 🚨 1. 배열 형태의 `dataKey` 사용 금지
*   **문제**: `dataKey={['low', 'high']}` 와 같이 속성값을 배열로 전달할 경우, 내부적으로 데이터 매핑이 꼬이거나 최신 Recharts 버전에서 payload를 생략해버려 화면에 캔들스틱이 전혀 나타나지 않습니다.
*   **해결책**: 백엔드 또는 프론트엔드 데이터 가공 단계에서 컴포넌트에 넘길 데이터에 명시적인 `range` 배열 객체를 추가하고, 이를 단일 문자열 키로 지정하세요.
    *   ❌ **잘못된 예:** `<Bar dataKey={['low', 'high']} shape={<CustomCandlestick />} />`
    *   ✅ **올바른 예:** 
        ```javascript
        // 1. 데이터에 명시적인 타겟 배열 삽입
        const formattedData = chartData.map(d => ({ ...d, range: [d.low, d.high] }));
        
        // 2. 단일 문자열 Key 사용
        <Bar dataKey="range" shape={<CustomCandlestick />} />
        ```

#### 🚨 2. NaN 및 undefined 좌표 방어 로직 필수
*   **문제**: 주식 데이터에서 거래정지일이 있거나 장 시작 전 데이터가 들어와 `close`, `open`, `high`, `low` 값이 누락되었을 때, 픽셀 계산 중 `NaN`이 발생하면 브라우저 렌더링 스레드가 중단(`ReferenceError` 등)되고 하얀(또는 검은) 화면이 뜹니다.
*   **해결책**: 커스텀 SVG Shape 컴포넌트(`CustomCandlestick`) 최상단에 항상 방어 코드를 작성하세요.
    ```javascript
    const CustomCandlestick = (props) => {
        const { x, y, width, height, payload } = props;

        // 1. 기본 좌표 누락 방어
        if (x == null || y == null || width == null || height == null) return <g></g>;
        if (Number.isNaN(x) || Number.isNaN(y)) return <g className="error-coord"></g>;

        const p = payload && payload.payload ? payload.payload : payload;
        if (!p) return <g></g>;

        // 2. 값 명시적 파싱 (배열 데이터의 구조 분해 대신 고유 payload 객체 직접 참조)
        const o = p.open !== undefined ? p.open : y;
        const c = p.close !== undefined ? p.close : y;
        const h = p.high !== undefined ? p.high : Math.max(o, c);
        const l = p.low !== undefined ? p.low : Math.min(o, c);
        
        // ... 중략 ...
    };
    ```

#### 🚨 3. 높이/크기가 0인 SVG 도형 방지
*   **문제**: 시가와 종가가 같을 경우(도지 캔들 등) `bodyHeight`가 0이 되어 SVG `rect`가 화면에 보이지 않게 됩니다.
*   **해결책**: 최소 높이 또는 너비를 강제로 지정해야 합니다.
    *   ✅ `const bodyHeight = Math.max(Math.abs(bodyBottom - bodyTop), 1);`

## 3. UI Component 패러다임 (CSS & Layout)

*   **브랜드 테마 (Sky Blue)**: 기존 Indigo 테마에서 **Sky Blue(`#0ea5e9` / `#38bdf8`)**로 전역 변경되었습니다. CSS 변수 `--accent-sky` 및 `--gradient-primary`를 최우선으로 사용합니다.
*   **색상 일관성**: 하락(음봉/감소)은 하늘색/파란색 계열(`#3b82f6`), 상승(양봉/증가)은 빨간색 계열(`#ef4444`)을 엄격히 유지합니다. (⚠️ 하락 색상과 브랜드 색상이 겹치지 않도록 채도와 명도 조절에 주의하세요.)
*   **숫자 포맷팅**: 모든 금융 데이터의 숫자는 천 단위 콤마 형식(`toLocaleString('ko-KR')`)을 따르며, 대량의 숫자는 '조, 억, 만' 단위로 축약하여 표시(`fmtBig` 유틸리티 함수 사용)합니다.
*   **반응형 차트**: 시각화 차트는 반드시 `<ResponsiveContainer width="100%" height={...}>`로 감싸서 브라우저 크기 조정 시 렌더링이 깨지지 않게 해야 합니다.
*   **테이블 데이터 줄바꿈 (Text Wrapping)**: 데이터 그리드 내에서 긴 텍스트가 잘리지 않도록 `white-space: normal` 또는 `word-break: break-all` 정책을 적용하여 가독성을 확보합니다.

## 4. FINEX 특정 디자인 시스템 가이드

### 4.1 'FINEX' 브랜드 레이블 (Header)
*   헤더 좌상단에 서비스 명칭 'FINEX'를 고정 노출할 때는 다음 스타일을 권장합니다:
    *   **Background**: `var(--gradient-primary)`
    *   **Style**: `padding: 2px 8px`, `border-radius: 4px`, `font-weight: 900`, `font-size: 0.9rem`
    *   **Label**: 대문자 'FINEX'를 사용하여 전문성을 강조합니다.

### 4.2 동적 'NEW' 배지 (Sidebar)
*   새로운 추천 건이 있을 때 노출되는 배지 스타일 가이드:
    *   **Color**: 브랜드 실버/하늘색 조합 (`background: rgba(56, 189, 248, 0.2)`, `color: #38bdf8`)
    *   **Padding**: `2px 6px`
    *   **로직**: 단순히 오늘 날짜 여부만 체크하는 것이 아니라, API 응답 형태(객체 배열 인지 여부)를 사전에 확인하여 안전하게 `some()` 메서드로 매칭해야 합니다.

### 4.3 데이터 테이블 페이징 (Pagination)
*   **사용 기준**: 조회 결과가 10건(또는 설정된 한계치)을 초과할 경우 반드시 하단 페이징 처리를 수행합니다.
*   **디자인 가이드**:
    *   **컬러**: 선택된 페이지 번호는 브랜드 컬러인 Sky Blue 배경에 흰색 텍스트를 사용합니다.
    *   **구성 요소**: [처음], [이전], 페이지 번호들, [다음], [끝] 버튼을 포함하여 이동의 편의성을 제공합니다.
    *   **UX 규칙**: 검색 필터나 정렬 순서가 변경될 경우, 페이지 번호는 항상 **1페이지로 초기화**되어야 합니다.
    *   **로딩 상태**: 페이지 전환 시 데이터 로딩 중임을 알리는 스피너 또는 스켈레톤 UI를 노출하여 사용자 이탈을 방지합니다.

## 5. 커스텀 툴팁 (Custom Tooltip) 및 범례 (Legend) 규칙

공용 시각화 컴포넌트(`ChartTooltip` 등)를 여러 차트(주가, MACD, RSI, 거래량)에서 재사용할 때, 불필요한 정보가 노출되는 것을 막고 직관성을 높이기 위해 다음 규칙을 준수합니다.

### 5.1 툴팁 데이터 노출 제한 (Props 제어)
*   **문제**: 메인 주가 차트뿐만 아니라 보조 지표 차트(MACD, RSI)에서도 마우스를 올릴 때마다 시가/고가/저가/종가(OHLC)가 병렬로 표시되면 시야가 분산됩니다.
*   **해결책**: 공통 `<ChartTooltip>` 컴포넌트 내부에 `showOhlc`와 같은 불리언(Boolean) Props 속성을 추가하여, 오직 **메인 주가 차트에서만 OHLC 렌더링을 허용**하도록 제한합니다.
    ```javascript
    // ✅ 올바른 예: 메인 차트에만 showOhlc 속성 주입
    <Tooltip content={<ChartTooltip showOhlc={true} />} /> // 주가 차트
    <Tooltip content={<ChartTooltip />} />                // 보조 지표 차트 (OHLC 숨김)
    ```

### 5.2 필터링 로직 최적화
*   동일한 X축을 공유하는 `<ComposedChart>` 내부의 모든 데이터 키(DataKey)가 툴팁 배열(`payload`)에 혼합되어 들어옵니다.
*   사용자가 해당 차트에 마우스를 올렸을 때 반드시 봐야 하는 중요 지표(예: MACD 수치, Histogram 값 등)가 `Array.map` 과 같은 임의의 필터 로직(`p.name !== 'Histogram'`)에 의해 실수로 배제되지 않도록 필터링 조건을 항상 주의 깊게 점검해야 합니다.

### 5.3 하드코딩된 범례 (명시적 UI)
*   Recharts의 `<Legend />` 컴포넌트 자동 생성에 의존하기보다, 각 차트 Card 상단 Header 영역에 **HTML + CSS 기반의 명시적인 커스텀 색상 범례**를 수동으로 삽입하는 것이 디자인 자유도 및 직관성 확보에 훨씬 유리합니다. (예: `양봉(상승)`, `음봉(하락)`, `MA5`, `과매수(70)` 등)

## 6. 실시간 API 연동 및 컴포넌트 렌더링 규칙 (데이터 바인딩)

실시간 API를 통해 수신된 데이터를 UI 컴포넌트(Dashboard Widget 등)에 매핑할 때, 렌더링 충돌(Crash)을 막고 재사용성을 높이기 위해 다음 원칙을 따릅니다.

### 6.1 명시적 숫자 형변환 (Type Safety)
*   **문제**: 백엔드 API에서 숫자 데이터가 간헐적으로 문자열(`"0.97"`, `"-38.78"`)로 전달될 수 있습니다. 이를 그대로 React 렌더링 구문에서 `.toFixed(2)` 나 `.toLocaleString()` 으로 호출하면 `TypeError`가 발생하며 전체 페이지 렌더링이 중단(Blank Screen)됩니다.
*   **해결책**: 백엔드에서 전달받은 수치형 데이터는 사용 전 반드시 `Number()` 로 명시적 캐스팅을 수행해야 합니다.
    ```javascript
    // ❌ 위험한 예: API 응답 문자열에 직접 Number 메서드 호출 시 앱 크래시
    <span>{item.yield.toFixed(2)}%</span>
    
    // ✅ 올바른 예: Number()로 변환 후 안전하게 포맷팅
    const yieldVal = Number(item.yield);
    <span>{yieldVal.toFixed(2)}%</span>
    ```

### 6.2 Presentational-Container 패턴 준수 (비동기 데이터 의존성 분리)
*   **핵심**: 위젯(예: `MarketIndices.jsx`, `TopThemes.jsx`) 그 자체는 순수하게 UI만 그리는 Presentational Component로 유지하세요. 내부에서 개별적으로 비동기 데이터(`fetch` 또는 `get...`)를 로드하거나 상태(`useState`, `useEffect`)를 들고 있는 것을 지양해야 합니다.
*   **해결책**:
    1.  상위 **Container(예: `Dashboard.jsx`)**에서 통합 API(`fetchDashboardSummary()`)를 단 1회 호출하여 모든 필요한 데이터를 `useState`로 담습니다.
    2.  로딩 상태(`loading: boolean`)를 함께 관리합니다.
    3.  하위 **Presenter(위젯 컴포넌트)**에는 `data`, `loading` Props만 순수하게 전달합니다.
    4.  하위 위젯은 `if (loading) return <Skeleton />` 처리만 하고 데이터 렌더링에 집중합니다.

## 7. Network Graph (네트워크 관계도) 렌더링 규칙

기업 지분 관계 등 노드(Node)와 링크(Link) 기반의 네트워크 시각화를 구현할 때는 반드시 **`react-force-graph-2d`** 라이브러리를 표준으로 사용하며, 다음 컴포넌트 작성 규칙을 엄격히 준수합니다.

### 7.1 반응형(Responsive) 캔버스 강제 규칙 (Blank 화면 방지)
*   **문제**: `react-force-graph-2d`는 렌더링 시점에 부모 컨테이너의 크기(`width=0`, `height=0`)를 명확히 인지하지 못하면 캔버스에 아무 요소도 그리지 않는(Blank) 치명적인 렌더링 누락 버그가 있습니다.
*   **해결책**:
    1.  그래프를 감싸는 부모 래퍼(Wrapper) 요소에 **최소 높이(`minHeight: '400px'` 등)**를 반드시 명시합니다.
    2.  `ResizeObserver`를 활용하여 부모 DOM 요소의 실제 크기를 측정하고, 이 값을 그래프 컴포넌트의 `width`, `height` Props에 동적으로 주입하는 패턴을 강제합니다.
    ```javascript
    // Container 요소의 ref를 이용해 ResizeObserver 설정
    const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
    // ... ResizeObserver 로직으로 dimensions 업데이트
    <ForceGraph2D width={dimensions.width} height={dimensions.height} /* ... */ />
    ```

### 7.2 Link(선) 텍스트 렌더링 각도(Angle) 계산 규칙
*   **목적**: 노드 간의 관계값(ex. 지분율 데이터)을 연결선(Link) 위에 텍스트로 시각화해야 합니다.
*   **해결책**: HTML 요소가 아닌 캔버스 컨텍스트 리페인팅 패턴을 사용해야 자연스럽습니다.
    1.  `linkCanvasObjectMode` 속성을 `() => 'after'` 로 설정하여 선이 그려진 직후 텍스트를 그립니다.
    2.  `linkCanvasObject` 속성 콜백 내부에서 `Math.atan2(target.y - source.y, target.x - source.x)` 공식을 사용하여 **선과 동일한 각도**로 텍스트 캔버스를 회전(`ctx.rotate`)시킨 후 텍스트를 렌더링합니다.

---
// 다음 UI 컴포넌트 추가/수정 시 이 PAC 규칙을 최우선으로 참고하여 작업하시기 바랍니다.
