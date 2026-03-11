# 💼 기타 스키마 상세

용도가 특정된 소규모 스키마들의 정보를 통합 관리합니다.

## 1. `fin_prod` (금융상품)
- `krx_etf_ohlcv` / `krx_etf_info`: **ETF 시세 및 종목 정보**
- `fss_deposit_prod` / `fss_save_prod`: 예적금 상품
- `fss_credit_loan`: 대출 상품

## 2. `industry` (산업지표)
- `ecos_all_original`: 전산업 통계
- `wics_industry_code`: WICS 분류 체계

## 3. `llm` (AI 분석)
- `stock_anly_reports`: AI가 생성한 종목 분석 리포트

## 4. `public` (시스템)
- `auth_user`: 사용자 계정
- `menu_list`: 시스템 메뉴 구성

> [!NOTE]
> ETF 정보 조회 시 `fin_prod.krx_etf_ohlcv`와 `fin_prod.krx_etf_info` 조인 패턴을 권장합니다.
