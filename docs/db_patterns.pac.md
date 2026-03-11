# 🛠️ SQL Patterns & Gotchas

PostgreSQL 기반 금융 데이터베이스 쿼리 작성 시 필수적으로 준수해야 할 결정론적 규칙과 템플릿입니다.

## 1. 결정론적 SQL 작성 규칙 (Deterministic Rules)

1. **스키마 명시 (Explicit Schema)**: 테이블 참조 시 항상 스키마명을 접두사로 사용하세요.
   - ✅ `market.krx_stocks_kospi_index`
2. **날짜 포맷 고정**: `TO_CHAR(date, 'YYYY-MM-DD') AS date` 사용을 권장합니다.
3. **명시적 형변환**: `data_value::numeric` 등 텍스트형 숫자는 반드시 캐스팅하세요.
4. **정렬 및 제한**: `ORDER BY date DESC LIMIT N`을 명시하여 일관된 결과를 보장하세요.
5. **컬럼 별칭**: 긴 컬럼명이나 가공 컬럼은 짧은 별칭(`AS close`, `AS value`)을 부여하세요.

## 2. 주요 주의사항 (Gotchas)

- **종가 컬럼명**: 
  - 지수 테이블(`market.krx_stocks_*_index`) → `closing_price`
  - 종목 테이블(`company.krx_stocks_ohlcv`) → `close`
- **종목코드**:
  - KRX 테이블 → `code`
  - 마스터/DART/KIS 테이블 → `stock_code`
  - *조인 시 주의:* `ON a.code = b.stock_code`
- **이름 정규화**: 기업명 조인 시 `(주)`, `주식회사`, 공백 등을 제거한 후 비교하세요.
  - `REPLACE(corp_name, '(주)', '')`

## 3. 핵심 쿼리 템플릿 (Templates)

### ETF 최신 시세 조회
```sql
SELECT o.code, COALESCE(i.kor_name, o.name) AS name, o.close 
  FROM fin_prod.krx_etf_ohlcv o 
  LEFT JOIN fin_prod.krx_etf_info i ON o.code = i.code 
 WHERE o.date = (SELECT MAX(date) FROM fin_prod.krx_etf_ohlcv)
 ORDER BY o.close DESC LIMIT 5;
```

### 네이버 테마 가중수익률
```sql
WITH theme_return AS (
    SELECT theme_name, date, SUM(cls_chg_rt * cap) / NULLIF(SUM(cap), 0) AS weighted_return
      FROM visual.vsl_naver_theme
     WHERE date = (SELECT MAX(date) FROM visual.vsl_naver_theme)
     GROUP BY theme_name, date
)
SELECT theme_name, ROUND(weighted_return, 2) AS yield
  FROM theme_return ORDER BY yield DESC LIMIT 5;
```

### 거시경제지표 (ECOS)
```sql
SELECT TO_CHAR(date, 'YYYY-MM-DD') AS date, data_value::numeric AS value
  FROM market.ecos_currency_all
 WHERE item_name1 = '원/미국달러(매매기준율)'
 ORDER BY date DESC LIMIT 2;
```
