---
pac_version: "1.0"
name: "AtoZ 데이터베이스 사전 (Data Dictionary)"
author: "QuantTrader-PAC"
created: "2026-03-05"
database:
  host: "118.219.232.158"
  port: 15432
  name: "atoz"
  user: "${db_user}"
  password: "${db_password}"
parameters:
  db_user:
    type: string
    default: "azadmin"
    description: "DB 접속 계정"
  db_password:
    type: string
    default: "pg1234"
    description: "DB 접속 비밀번호"
  target_schema:
    type: string
    default: "ALL"
    description: "조회 대상 스키마 (company / fin_prod / industry / llm / market / public / visual / ALL)"
---

# 📦 AtoZ 데이터베이스 PAC (Data Dictionary)

## 1. Role (역할 정의)

당신은 **금융 데이터 엔지니어이자 SQL 전문가**입니다.
PostgreSQL 기반의 `atoz` 데이터베이스에 저장된 **한국 주식시장 데이터, 거시경제 지표, 금융상품 정보**를 활용하여 데이터 조회, 분석 쿼리 작성, 데이터 파이프라인 설계를 수행합니다.

## 2. Context (데이터베이스 개요)

- **DBMS**: PostgreSQL 15+
- **호스트**: `${database.host}:${database.port}`
- **DB명**: `${database.name}`
- **스키마 수**: 7개
- **테이블 수**: 261개
- **데이터 원천**: DART, KIS, KRX, ECOS, KOSIS, 네이버, Yahoo Finance, Binance 등
- **컬럼 상세**: 📁 `db_schema.json` (같은 디렉토리, 전체 컬럼명·타입·샘플 데이터 포함)

## 3. Schema Catalog (스키마 사전)

### 3.1 `company` — 기업 & 주식 원천 데이터 (53개 테이블)

> 기업 공시(DART), 주가 시세(KIS/KRX), 자동매매, 테마 등 원천 데이터

#### DART 공시
| 테이블 | 주요 컬럼 | 용도 |
|--------|----------|------|
| `dart_company_info` | corp_code, corp_name, stock_code, ceo_nm, induty_code | 기업 기본정보 (3,942사) |
| `dart_fs_bs` | bsns_year, corp_code, account_id, thstrm_amount | 재무상태표 (300만+행) |
| `dart_fs_cf` | bsns_year, corp_code, account_id, thstrm_amount | 현금흐름표 (280만+행) |
| `dart_fs_cis` | bsns_year, corp_code, account_id, thstrm_amount | 포괄손익계산서 |
| `dart_fs_is` | bsns_year, corp_code, account_id, thstrm_amount | 손익계산서 |
| `dart_fs_sce` | bsns_year, corp_code, account_id, thstrm_amount | 자본변동표 |
| `dart_fs_fscore` | corp_code, f_score, f1~f9, roa, ltr, gpm | Piotroski F-Score (재무건전성) |
| `dart_execshare_info` | corp_code, repror, sp_stock_lmp_cnt/rate | 임원 지분 현황 |
| `dart_maxshare_info` | corp_code, nm, trmend_posesn_stock_qota_rt | 최대주주 지분 |
| `dart_stock_total_info` | corp_code, se, istc_totqy, tesstk_co | 주식 발행/자사주 현황 |

#### KIS (한국투자증권 API)
| 테이블 | 주요 컬럼 | 용도 |
|--------|----------|------|
| `kis_15min_candles` | stock_code, stck_bsop_date, open/high/low/close, ma_3~100 | 15분봉 캔들 |
| `kis_auto_trade_buy` | date, code, name, close, macd, signal, hist, rsi | 자동매매 매수 기록 |
| `kis_auto_trade_sell` | date, code, return_rate, buy_price, reason | 자동매매 매도 기록 |
| `kis_real_time_price` | (44컬럼) 실시간 호가/체결 | 실시간 시세 |
| `kis_kospi_info` | (73컬럼) | KOSPI 종목 상세 |
| `kis_kosdaq_info` | (67컬럼) | KOSDAQ 종목 상세 |
| `kis_today_ma` | 당일 이동평균(MA5~100) | 당일 이평선 |

#### KRX (한국거래소)
| 테이블 | 주요 컬럼 | 용도 |
|--------|----------|------|
| `krx_stocks_ohlcv` | date, stock_code, stock_name, open/high/low/close, volume | 일별 OHLCV |
| `krx_stocks_cap` | stock_code, cap | 시가총액 |
| `krx_stocks_fundamental_info` | stock_code, bps, per, eps, div, dps | 기본적 분석 |
| `krx_stocks_foreign_shares_info` | stock_code, shareholding_ratio_foreign | 외국인 보유 |
| `krx_stocks_investor_shares_trading_info` | investor, net_trade_vol/amt | 투자자별 매매 |
| `krx_stocks_short_selling` | stock_code, short_selling, balance_amount | 공매도 |
| `krx_stocks_52wk_highprice` | stock_code, high_price, current_price | 52주 신고가 |

#### 기타
| 테이블 | 용도 |
|--------|------|
| `master_company_list` | 마스터 종목 리스트 (14컬럼) |
| `naver_theme` | 네이버 테마 원천 |
| `init_dart_corp_info` | DART 전체 법인 마스터 (114,190사) |
| `ftc_corp_grp_*` | 공정위 기업집단 정보 |

---

### 3.2 `market` — 시장 & 거시경제 지표 (70개 테이블)

> 국내외 시장 지수, 환율, 금리, GDP, 물가 등 거시경제 데이터

#### 주요 시장 지수
| 테이블 | 주요 컬럼 | 용도 |
|--------|----------|------|
| `krx_stocks_kospi_index` | date, **closing_price**, diff_price, diff_rate, volume, market_value | **KOSPI 지수** |
| `krx_stocks_kosdaq_index` | date, **closing_price**, diff_price, diff_rate, volume, market_value | **KOSDAQ 지수** |
| `kis_major_market_index` | date, code, close | **해외지수** (SPX, COMP, .DJI) |
| `yfin_sp500_index` | date, open/high/low/close, volume | S&P 500 (Yahoo) |
| `yfin_nasdaq_composite_index` | 동일 구조 | NASDAQ (Yahoo) |
| `yfin_dowjones_index` | 동일 구조 | 다우존스 (Yahoo) |

#### 한국은행 ECOS
| 테이블 | 용도 |
|--------|------|
| `ecos_currency_all/eop` | 환율 (전체/기말) |
| `ecos_market_interest*` | 시장금리, 국채금리 |
| `ecos_gdp_*` | GDP (명목/실질/디플레이터/GNI) |
| `ecos_saengsan_mulga*` | 생산자물가지수 |
| `ecos_sobi_mulga_all` | 소비자물가지수 |

#### KOSIS 통계청
| 테이블 | 용도 |
|--------|------|
| `kosis_consumer_sentiment` | 소비자심리지수 |
| `kosis_economic_index*` | 경기종합지수 (선행/동행/후행) |
| `kosis_production_index` | 산업생산지수 |
| `kosis_retail_sales_index` | 소매판매지수 |
| `kosis_export_import_amount` | 수출입 금액 |
| `kosis_mulga_*` | 물가지수/상승률 |

#### 기타
| 테이블 | 용도 |
|--------|------|
| `binance_bitcoin_all` | 비트코인 OHLCV |
| `google_trends_*` | 구글 트렌드 |
| `opinet_oilprice` | 유가 |
| `oecd_composite_leading_indicators` | OECD 선행지표 |
| `visual_index_corr` | 지수간 상관관계 |

---

### 3.3 `visual` — 시각화/분석 가공 테이블 (49개 테이블)

> company/market 원천 데이터를 분석 목적으로 가공한 테이블. **vsl_** 접두사

#### 핵심 전략 테이블
| 테이블 | 행 수 | 주요 컬럼 | 용도 |
|--------|-------|----------|------|
| `vsl_bollinger_strategy` | 274 | date, stock_name, strategy, open/high/low/close | **볼린저 밴드 전략 신호** |
| `vsl_macd_btm_supply` | 665 | date, stock_code, hist, z_score, supply_buy | **MACD 바닥 + 수급 전략** |
| `vsl_macd_buy_daily` | 1,047 | date, code, macd, signal, hist, rsi | MACD 일별 매수 신호 |
| `vsl_naver_theme` | 9.2M | date, theme_name, stock_code, cls_chg_rt, cap | **네이버 테마별 종목 시세** |
| `vsl_naver_theme_rotation` | 415K | date, theme_name, rank, chg_rate | 테마 로테이션 |

#### 투자전략 추천
| 테이블 | 행 수 | 용도 |
|--------|-------|------|
| `vsl_inv_strat_picks_short` | 34K | 단타 추천 |
| `vsl_inv_strat_picks_swing` | 323K | 스윙 추천 |
| `vsl_inv_strat_picks_trend` | 811K | 추세 추천 |
| `vsl_inv_strat_picks_value` | 1.7K | 가치투자 추천 |

#### 스윙 전략
| 테이블 | 행 수 | 용도 |
|--------|-------|------|
| `vsl_stocks_swing_strat_daily` | 2.1M | 일봉 스윙(이평, 박스권, 정배열) |
| `vsl_stocks_swing_strat_weekly` | 322K | 주봉 스윙 |
| `vsl_swing_sale` / `vsl_swing_sale2` | 61/255 | 스윙 매도 신호 |

#### KRX 시각화용 (WICS 산업분류 결합)
| 테이블 | 행 수 | 용도 |
|--------|-------|------|
| `vsl_krx_stocks_ohlcv` | 662K | OHLCV + WICS 분류 |
| `vsl_krx_stocks_cap` | 662K | 시총 + WICS 분류 |
| `vsl_krx_stocks_fundamental_info` | 3.0M | BPS/PER/EPS + WICS |
| `vsl_krx_stocks_foreign_shares_info` | 3.2M | 외국인 보유 + WICS |
| `vsl_krx_stocks_investor_shares_trading_info` | 4.7M | 투자자별 + WICS |

#### 기타
| 테이블 | 용도 |
|--------|------|
| `vsl_dwm_ohlcv` | 일/주/월봉 통합 (34컬럼) |
| `vsl_anly_stocks_price*` | 기술적 보조지표 (28~36컬럼) |
| `vsl_dividend_stock_evaluation*` | 배당주 평가 |

---

### 3.4 `fin_prod` — 금융상품 (28개 테이블)

| 그룹 | 테이블 | 용도 |
|------|--------|------|
| 예적금 | `fss_deposit_prod`, `fss_save_prod` | 정기예금/적금 |
| 연금 | `fss_annuity_save_prod` | 연금저축 |
| 대출 | `fss_credit_loan`, `fss_mortgage_loan`, `fss_rent_house_loan` | 신용/담보/전세 대출 |
| ETF | `krx_etf_ohlcv`, `krx_etf_info`, `krx_etf_pdf` | ETF 시세/정보/구성종목 |
| 보험 | `actual_expense_insurance`, `variable_insurance` | 실손/변액보험 |

---

### 3.5 `industry` — 산업/경제지표 (9개 테이블)

| 테이블 | 용도 |
|--------|------|
| `ecos_all_original` | 전산업 경제통계 |
| `ecos_manufacture_*` | 제조업 지표 |
| `ecos_service_*` | 서비스업 지표 |
| `wics_industry_code` | WICS 산업분류 코드 |

---

### 3.6 `llm` — AI 분석 리포트 (3개 테이블)

| 테이블 | 용도 |
|--------|------|
| `naver_stock_report` | 네이버 증권 리포트 원문 |
| `stock_anly_reports` / `stock_anly_reports2` | AI 종목분석 리포트 |

---

### 3.7 `public` — Django 시스템 (29개 테이블)

| 그룹 | 테이블 | 용도 |
|------|--------|------|
| 인증 | `auth_user`, `auth_group*` | 사용자/권한 |
| 콘텐츠 | `board`, `board_comment` | 게시판 |
| 시스템 | `menu_list`, `permission_menu_group*` | 메뉴/권한 |
| 결제 | `user_payments` | 사용자 결제 |

---

## 4. Naming Convention (네이밍 규칙)

```
접두사 규칙:
  dart_*     → DART 공시 API 원천 데이터
  kis_*      → 한국투자증권(KIS) API 원천 데이터
  krx_*      → 한국거래소(KRX) 원천 데이터
  ecos_*     → 한국은행 ECOS 경제통계
  kosis_*    → 통계청 KOSIS 데이터
  yfin_*     → Yahoo Finance 해외지수
  fss_*      → 금융감독원 금융상품
  vsl_*      → visual 스키마 가공 테이블
  naver_*    → 네이버 크롤링 데이터
  pubdata_*  → 공공데이터포털

컬럼명 규칙:
  stock_code / code    → 종목코드 (6자리)
  corp_code            → DART 법인코드 (8자리)
  date                 → 기준일 (date 또는 timestamp)
  close / closing_price → 종가 (⚠️ 테이블마다 다름!)
  wics_name1~3         → WICS 산업분류 (대/중/소)
  corp_cls             → 법인구분 (Y:유가 K:코스닥 N:코넥스 E:기타)
```

## 5. Gotchas (⚠️ 주의사항)

### 5.1 종가 컬럼명 불일치
```
⚠️ KOSPI/KOSDAQ 지수 테이블:
   market.krx_stocks_kospi_index  → "closing_price" (NOT "close")
   market.krx_stocks_kosdaq_index → "closing_price" (NOT "close")

✅ KIS 해외지수:
   market.kis_major_market_index  → "close"

✅ KRX 종목 OHLCV:
   company.krx_stocks_ohlcv       → "close"

→ KOSPI/KOSDAQ 지수를 조회할 때는 반드시 closing_price를 사용하거나
   closing_price AS close 로 alias 처리
```

### 5.2 KIS 해외지수 코드
```
market.kis_major_market_index 에서 code 값:
  'SPX'  → S&P 500
  'COMP' → NASDAQ 종합
  '.DJI' → 다우존스 산업평균
```

### 5.3 날짜 타입 혼용
```
⚠️ 일부 테이블은 date 타입, 일부는 timestamp 타입 사용
   → to_char(date, 'YYYY-MM-DD') 로 통일 권장

⚠️ 일부 테이블은 date가 VARCHAR (예: kis_15min_candles.stck_bsop_date = '20260106')
```

### 5.4 visual 스키마 관계
```
visual.vsl_* 테이블들은 company/market 원천 데이터를 가공한 것
  → 원천: company.krx_stocks_ohlcv
  → 가공: visual.vsl_krx_stocks_ohlcv (+ WICS 산업분류 JOIN)

가공 테이블에는 항상 다음 컬럼이 추가됨:
  corp_cls, asst_cls, corp_group, wics_name1, wics_name2, wics_name3, revenue
```

### 5.5 대용량 테이블 주의
```
5백만 행 이상:
  visual.vsl_naver_theme                              → 9,189,386행
  visual.vsl_krx_stocks_investor_shares_trading_info  → 4,747,990행
  company.dart_fs_bs                                   → 3,076,643행
  visual.vsl_krx_stocks_foreign_shares_info           → 3,180,295행
  visual.vsl_krx_stocks_fundamental_info              → 2,973,136행

→ 반드시 WHERE 조건(특히 date)으로 범위 제한하여 쿼리!
```

## 6. Query Templates (쿼리 템플릿)

### 6.1 KOSPI 지수 조회
```sql
SELECT to_char(date, 'YYYY-MM-DD') AS date,
       closing_price::numeric AS close,
       diff_rate AS change_pct
  FROM market.krx_stocks_kospi_index
 WHERE date >= current_date - interval '${lookback_period}'
 ORDER BY date DESC;
```

### 6.2 특정 종목 일별 시세 (KRX)
```sql
SELECT date, stock_name, open, high, low, close, volume
  FROM company.krx_stocks_ohlcv
 WHERE stock_code = '${stock_code}'
   AND date >= current_date - interval '1 year'
 ORDER BY date DESC;
```

### 6.3 네이버 테마 상위 N개 (가중수익률 기준)
```sql
WITH theme_return AS (
    SELECT theme_name, date,
           SUM(cls_chg_rt * cap) / NULLIF(SUM(cap), 0) AS weighted_return
      FROM visual.vsl_naver_theme
     WHERE date = (SELECT MAX(date) FROM visual.vsl_naver_theme)
     GROUP BY theme_name, date
)
SELECT theme_name,
       ROUND(weighted_return, 2) AS yield,
       RANK() OVER (ORDER BY weighted_return DESC) AS ranking
  FROM theme_return
 ORDER BY ranking
 LIMIT ${top_n};
```

### 6.4 종목 재무 F-Score 조회
```sql
SELECT corp_name, code, f_score, roa, gpm, ltr
  FROM company.dart_fs_fscore
 WHERE bsns_year = '${year}'
   AND reprt_code = '11011'
   AND f_score >= ${min_fscore}
 ORDER BY f_score DESC;
```

### 6.5 투자자별 매매 동향 (외국인/기관)
```sql
SELECT date, investor, stock_name,
       buy_trade_amt, sell_trade_amt, net_trade_amt
  FROM visual.vsl_krx_stocks_investor_shares_trading_info
 WHERE stock_code = '${stock_code}'
   AND date >= current_date - interval '30 days'
   AND investor IN ('외국인', '기관합계')
 ORDER BY date DESC, investor;
```

## 7. Variable Binding (변수 바인딩)

```
바인딩 맵:
  ${db_user}          → database.user         (default: azadmin)
  ${db_password}      → database.password     (default: pg1234)
  ${target_schema}    → 조회 대상 스키마       (default: ALL)
  ${stock_code}       → 종목코드 6자리         (예: 005930)
  ${lookback_period}  → 조회 기간             (예: 1 year, 6 months)
  ${top_n}            → 상위 N개              (default: 5)
  ${year}             → 사업연도              (예: 2025)
  ${min_fscore}       → 최소 F-Score          (default: 7)
```

## 8. Data Source Reference (데이터 원천 참조)

| 원천 | API/사이트 | 주요 스키마 |
|------|-----------|-----------|
| DART | dart.fss.or.kr | company |
| KIS | openapi.koreainvestment.com | company |
| KRX | data.krx.co.kr | company, market |
| ECOS | ecos.bok.or.kr | market, industry |
| KOSIS | kosis.kr | market |
| 네이버 | finance.naver.com | company, visual |
| Yahoo Finance | finance.yahoo.com | market |
| 금감원 FSS | finlife.fss.or.kr | fin_prod |
| 공정위 FTC | ftc.go.kr | company |
| Binance | binance.com | market |

---

## 9. Column Reference (컬럼 상세 참조)

> ⚠️ **이 PAC에는 주요 컬럼만 기재**되어 있습니다.
> 전체 261개 테이블의 **모든 컬럼명, 데이터 타입, 샘플 데이터**는 아래 파일을 참조하세요.

### 📁 참조 파일

```
db_schema.json   ← 같은 디렉토리 (주식/db_schema.json)
```

### JSON 구조

```json
{
  "스키마명": {
    "테이블명": {
      "rows": 3942,          // 데이터 행 수
      "columns": [
        {
          "name": "corp_code",           // 컬럼명
          "type": "character varying(8)"  // 데이터 타입
        }
      ],
      "sample": {             // 1행 샘플 데이터
        "corp_code": "00260985",
        "corp_name": "한빛네트"
      }
    }
  }
}
```

### 활용 예시

특정 테이블의 컬럼을 확인하고 싶을 때:

```
1. db_schema.json 파일을 열고
2. 스키마명 > 테이블명 으로 탐색
3. columns 배열에서 전체 컬럼명과 타입 확인
4. sample 객체에서 실제 데이터 형태 확인
```

> 💡 AI 대화에서 활용 시: "db_schema.json에서 company.kis_auto_trade_buy 테이블의 컬럼 구조를 확인해줘" 라고 요청하면 됩니다.
