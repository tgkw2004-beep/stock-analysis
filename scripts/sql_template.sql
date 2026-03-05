-- ============================================================================
-- Bollinger Band 3대 전략 & 이평선 관통 전략 — SQL 원천 데이터 조회 템플릿
-- ============================================================================
-- 변수 바인딩:
--   ${target_date}   : 분석 대상일 (YYYY-MM-DD)
--   ${market}        : 대상 시장 (KOSPI / KOSDAQ / ALL)
--   ${lookback_days} : 6개월 Bandwidth Min/Max 회고 기간 (영업일 수)
-- ============================================================================

WITH base AS (
    SELECT
        s.ticker,
        s.name,
        s.close,
        s.volume,
        s.trade_date
    FROM stock_daily s
    WHERE s.trade_date = '${target_date}'
      AND (
          '${market}' = 'ALL'
          OR s.market = '${market}'
      )
),

-- Bollinger Band 기본 지표 (20일 기준)
bollinger AS (
    SELECT
        b.ticker,
        b.bb_upper,
        b.bb_middle,
        b.bb_lower,
        b.bb_bandwidth,
        b.trade_date
    FROM indicator_bollinger b
    WHERE b.trade_date = '${target_date}'
),

-- 6개월 Bandwidth Min/Max (Squeeze 산출용)
bandwidth_range AS (
    SELECT
        b.ticker,
        MIN(b.bb_bandwidth) AS min_bw_6m,
        MAX(b.bb_bandwidth) AS max_bw_6m
    FROM indicator_bollinger b
    WHERE b.trade_date BETWEEN
          DATE_SUB('${target_date}', INTERVAL ${lookback_days} DAY)
          AND '${target_date}'
    GROUP BY b.ticker
),

-- 하단밴드 터치 횟수 (최근 3영업일)
lower_touch AS (
    SELECT
        s.ticker,
        SUM(CASE WHEN s.low <= ib.bb_lower THEN 1 ELSE 0 END) AS hit_lower_3d
    FROM stock_daily s
    JOIN indicator_bollinger ib ON s.ticker = ib.ticker AND s.trade_date = ib.trade_date
    WHERE s.trade_date BETWEEN
          DATE_SUB('${target_date}', INTERVAL 4 DAY)
          AND '${target_date}'
    GROUP BY s.ticker
),

-- MACD 지표 (당일 + 전일)
macd_data AS (
    SELECT
        m.ticker,
        m.macd,
        m.macd_signal,
        ROUND(m.macd - m.macd_signal, 4)        AS macd_hist,
        LAG(ROUND(m.macd - m.macd_signal, 4))
            OVER (PARTITION BY m.ticker ORDER BY m.trade_date) AS macd_hist_prev
    FROM indicator_macd m
    WHERE m.trade_date BETWEEN
          DATE_SUB('${target_date}', INTERVAL 1 DAY)
          AND '${target_date}'
),

-- ADX & MFI 지표
trend_data AS (
    SELECT
        t.ticker,
        t.adx,
        t.mfi
    FROM indicator_trend t
    WHERE t.trade_date = '${target_date}'
),

-- 이동평균선 (MA3, MA224: 당일 + 전일)
ma_data AS (
    SELECT
        ma.ticker,
        ma.ma3,
        ma.ma224,
        LAG(ma.ma3)   OVER (PARTITION BY ma.ticker ORDER BY ma.trade_date) AS ma3_prev,
        LAG(ma.ma224)  OVER (PARTITION BY ma.ticker ORDER BY ma.trade_date) AS ma224_prev
    FROM indicator_ma ma
    WHERE ma.trade_date BETWEEN
          DATE_SUB('${target_date}', INTERVAL 1 DAY)
          AND '${target_date}'
)

-- ============================================================================
-- 최종 결합: 분석 엔진 입력용 종합 데이터셋
-- ============================================================================
SELECT
    bs.ticker,
    bs.name,
    bs.close,
    bs.volume,

    -- Bollinger Band
    bb.bb_upper,
    bb.bb_middle,
    bb.bb_lower,
    bb.bb_bandwidth,
    br.min_bw_6m,
    br.max_bw_6m,

    -- Bandwidth Squeeze 계산
    ROUND(1 - (br.min_bw_6m / NULLIF(br.max_bw_6m, 0)), 4) AS bandwidth_squeeze,

    -- 하단밴드 터치
    COALESCE(lt.hit_lower_3d, 0) AS hit_lower_3d,

    -- MACD
    md.macd,
    md.macd_signal,
    md.macd_hist,
    md.macd_hist_prev,

    -- ADX & MFI
    td.adx,
    td.mfi,

    -- 이동평균선
    mad.ma3,
    mad.ma224,
    mad.ma3_prev,
    mad.ma224_prev

FROM base bs
LEFT JOIN bollinger bb        ON bs.ticker = bb.ticker
LEFT JOIN bandwidth_range br  ON bs.ticker = br.ticker
LEFT JOIN lower_touch lt      ON bs.ticker = lt.ticker
LEFT JOIN macd_data md        ON bs.ticker = md.ticker AND md.macd_hist IS NOT NULL
LEFT JOIN trend_data td       ON bs.ticker = td.ticker
LEFT JOIN ma_data mad         ON bs.ticker = mad.ticker AND mad.ma3_prev IS NOT NULL

ORDER BY bs.ticker;
