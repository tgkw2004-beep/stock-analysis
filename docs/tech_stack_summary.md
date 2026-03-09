# 🚀 FINEX 기술 스택 요약 및 분석

주식 분석 사이트 **FINEX**의 현재 개발 내용과 사용된 기술 스택을 단계별로 정리하고, 향후 발전 방향을 위한 추천 사항을 제안합니다.

---

## 1. 기획 & 설계 (Planning & Design)
*   **PAC (Prompt as Code) 기반 개발**: `.pac.md` 문서를 통해 UI 컴포넌트 규칙, DB 사전, 트러블슈팅 로그를 관리하는 실무 중심의 문서화 전략을 채택했습니다.
*   **데이터 중심 설계**: DB 스키마와 딕셔너리를 먼저 정의하고, 이를 바탕으로 백엔드 API와 프론트엔드 UI를 구축하여 데이터 정합성을 높였습니다.

## 2. 프론트엔드 (Frontend)
*   **엔진**: `React 19` (Vite 번들러)
*   **상태 관리**: React Hooks (`useState`, `useEffect`, `useMemo`)를 활용한 선언적 상태 관리.
*   **스타일링**: **Vanilla CSS & CSS Variables**. 디자인 시스템(테마 컬러, 타이포그래피)을 변수로 관리하여 Sky Blue(FINEX) 브랜딩을 전역 적용했습니다.
*   **시각화**: `Recharts`. 캔들스픽 차트, 이동평균선, 거래량, 보조지표(MACD, RSI)를 커스텀 SVG Shape으로 구현했습니다.
*   **아이콘**: `Lucide-React`.

## 3. 백엔드 (Backend)
*   **런타임**: `Node.js`
*   **프레임워크**: `Express.js`
*   **데이터 처리**: 
    *   **Server-side Indicator Calculation**: 프론트엔드 부하를 줄이기 위해 MA, MACD, RSI 등의 기술적 지표를 서버에서 계산하여 서빙합니다.
    *   **Unified Summary API**: 대시보드 진입 시 여러 데이터를 한 번에 가져오는 전용 엔드포인트를 구축했습니다.
*   **미들웨어**: `cors`, `dotenv`, `pg` (PostgreSQL Client).

## 4. 데이터베이스 (Database)
*   **엔진**: `PostgreSQL`
*   **데이터 소스**: 
    *   **company**: KRX 시세, KRX 주실 펀더멘털, DART 기업 정보/재무제표.
    *   **market**: 한국은행(ECOS) 경제지표, 해외 지수(Yahoo Finance API 연동 데이터).
    *   **visual**: 전략 분석 결과(Bollinger, MACD) 및 네이버 테마 데이터 가공 테이블.
*   **운영**: 외부 원격 DB 서버(Shared Engine) 연동.

## 5. 배포 & DevOps (Deployment)
*   **프론트엔드**: `GitHub Pages` (정적 호스팅)
*   **백엔드**: Node.js 전용 인스턴스 (현재 로컬/프라이빗 운영 중)
*   **CI/CD**: Git 기반 소스 코드 관리 및 `scripts/fetch-data.js`를 통한 주기적 데이터 수집 자동화.

---

## 💡 단계별 추천 및 개선 방향

### [프론트엔드] TypeScript 도입
*   **추천**: 현재 JavaScript에서 **TypeScript**로의 전환을 강력히 추천합니다.
*   **이유**: API 응답 데이터가 복잡하고 금융 수치를 다루므로, 타입 정의를 통해 컴파일 타임에 오류를 찾아내고 개발 생산성을 높일 수 있습니다.

### [백엔드] TanStack Query (React Query) 도입
*   **추천**: `useState/useEffect` 기반의 데이터 패칭을 **TanStack Query**로 교체.
*   **이유**: 자동 캐싱, 배경 업데이트(Stale-while-revalidate), 로딩 및 에러 상태의 우아한 처리가 가능해져 사용자 경험(UX)이 획기적으로 개선됩니다.

### [데이터베이스] Materialized View 활용
*   **추천**: 실시간 계산이 필요한 복잡한 조인 쿼리(테마별 가중수익률 등)를 **구체화된 뷰(Materialized View)**로 관리.
*   **이유**: 데이터 로딩 속도를 최적화하고 백엔드 서버의 연산 부담을 줄일 수 있습니다.

### [인프라] Docker 컨테이너화
*   **추천**: 백엔드와 DB 설정을 **Docker** 기반으로 구성.
*   **이유**: 어떤 환경에서도 동일한 개발/배포 환경을 유지할 수 있으며, 서비스 확장이 용이해집니다.
