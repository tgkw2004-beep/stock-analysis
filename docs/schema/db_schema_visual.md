# 🎨 Schema: `visual` (분석 및 가공 데이터)

원천 데이터를 기술적 분석 및 시각화 용도로 가공한 `vsl_` 접두사 테이블들을 포함합니다.

## 주요 테이블 그룹

### 1. 전략 및 신호 (PostgreSQL: `visual.vsl_*`)
- `vsl_bollinger_strategy`: 볼린저 밴드 매매 신호
- `vsl_macd_btm_supply`: MACD 바닥 수급 전략 리스트
- `vsl_inv_strat_picks_*`: 기간별(Short/Swing/Trend) 추천 종목

### 2. 테마 분석
- `vsl_naver_theme`: 테마별 종목 가중수익률 분석 (대용량)
- `vsl_naver_theme_rotation`: 테마 순환매 랭킹

### 3. 분석용 마스터 (PostgreSQL: `visual.vsl_krx_*`)
- `vsl_krx_stocks_ohlcv`: OHLCV 데이터에 WICS 산업분류가 조인된 형태 (**강력 권장**)
- `vsl_krx_stocks_investor_shares_trading_info`: 투자자별 매매동향 + WICS

### 4. 기타 보조지표
- `vsl_dwm_ohlcv`: 일/주/월 통합 캔들
- `vsl_anly_stocks_price`: 각종 기술적 보조지표 (RSI, MFI 등)

> [!TIP]
> `visual` 스키마 테이블들은 대부분 `wics_name1~3` 등 분석용 메타데이터를 이미 포함하고 있어 JOIN 비용을 줄여줍니다.
