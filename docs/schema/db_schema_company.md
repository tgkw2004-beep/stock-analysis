# 🏢 Schema: `company` (기업 & 주식 원천)

기업 공시(DART), 주가 시세(KIS/KRX), 테마 등 원천 데이터를 포함합니다.

## 주요 테이블 그룹

### 1. DART 공시 (PostgreSQL: `company.dart_*`)
- `dart_company_info` (~4K): 기업 기본정보
- `dart_fs_bs/cf/cis/is/sce` (~1.5M~3M): 재무제표 (상태표, 현금흐름, 손익 등)
- `dart_fs_fscore` (~86K): Piotroski F-Score 분석 결과
- `dart_execshare_info` (~24K) / `dart_maxshare_info` (~96K): 지분 현황

### 2. KIS 한국투자증권 (PostgreSQL: `company.kis_*`)
- `kis_15min_candles`: 15분봉 시세
- `kis_auto_trade_buy/sell`: 자동매매 기록
- `kis_kospi_info` / `kis_kosdaq_info`: 종목 상세 마스터

### 3. KRX 한국거래소 (PostgreSQL: `company.krx_*`)
- `krx_stocks_ohlcv` (~4M): **일별 OHLCV (가장 많이 사용)**
- `krx_stocks_cap` (~4M): 시가총액 정보
- `krx_stocks_fundamental_info` (~3.8M): 투자지표 (PER, PBR 등)
- `krx_stocks_investor_shares_trading_info` (~29M): 투자자별 매매동향

### 4. 마스터 및 기타
- `master_company_list`: 종목 마스터 + WICS 산업분류 결합 (**JOIN 필수 권장**)
- `naver_theme`: 네이버 금융 테마 정보

> [!TIP]
> 상세 컬럼 및 데이터 타입은 `db_schema.json`의 `company` 항목을 참조하세요.
