# 📊 Schema: `market` (시장 & 거시경제)

국내외 지수, 환율, 금리, GDP 등 거시경제 지표를 포함합니다.

## 주요 테이블 그룹

### 1. 시장 지수 (PostgreSQL: `market.*`)
- `krx_stocks_kospi_index` / `krx_stocks_kosdaq_index`: 국내 지수 (**closing_price** 컬럼 주의)
- `kis_major_market_index`: 해외지수 (SPX, COMP, .DJI)
- `yfin_sp500_index` / `yfin_nasdaq_composite_index`: Yahoo Finance 데이터

### 2. ECOS 한국은행 (PostgreSQL: `market.ecos_*`)
- `ecos_currency_all`: 환율 데이터 (`date`, `item_name1`)
- `ecos_market_interest`: 금리 데이터
- `ecos_sobi_mulga_all`: 소비자물가지수 (**yyyymm** 컬럼 사용)

### 3. KOSIS 통계청 (PostgreSQL: `market.kosis_*`)
- `kosis_consumer_sentiment`: 소비자심리지수
- `kosis_economic_index`: 경기종합지수

### 4. 기타 지표
- `binance_bitcoin_all`: 비트코인 시세
- `opinet_oilprice`: 유가

> [!IMPORTANT]
> ECOS 데이터 조회 시 `data_value::numeric` 형변환이 필수입니다. (`db_patterns.pac.md` 참조)
