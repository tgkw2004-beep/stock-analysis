---
pac_version: "1.1"
name: "AtoZ 데이터베이스 통합 사전 (Optimized)"
author: "QuantTrader-PAC"
created: "2026-03-11"
database:
  host: "${db_host}"
  port: ${db_port}
  name: "${db_name}"
---

# 📦 AtoZ 데이터베이스 PAC (Core)

## 1. 역할 및 목표
PostgreSQL 기반 `atoz` DB의 구조를 파악하고, 최적화된 SQL을 생성하기 위한 메인 가이드입니다. 
토큰 효율화를 위해 상세 내용은 모듈별로 분리되어 있습니다.

## 2. 문서 구조 (모듈)
- 🛠️ [SQL 패턴 & 규칙](file:///c:/Users/grunet/Desktop/박건우/project/antigravity/주식/web/docs/db_patterns.pac.md): 쿼리 작성 시 필수 규칙 및 템플릿
- 📁 [스키마: Company](file:///c:/Users/grunet/Desktop/박건우/project/antigravity/주식/web/docs/schema/db_schema_company.md): 기업, 주가, 공시 원천 데이터
- 📊 [스키마: Market](file:///c:/Users/grunet/Desktop/박건우/project/antigravity/주식/web/docs/schema/db_schema_market.md): 시장 지수, 거시경제 지표
- 🎨 [스키마: Visual](file:///c:/Users/grunet/Desktop/박건우/project/antigravity/주식/web/docs/schema/db_schema_visual.md): 분석 가공 및 기술적 지표
- 💼 [기타 스키마](file:///c:/Users/grunet/Desktop/박건우/project/antigravity/주식/web/docs/schema/db_schema_others.md): 금융상품(ETF), 산업, 시스템 정보

## 3. 핵심 규칙 요약
- **스키마 접두사 필수**: `schema.table` 형태로 호출
- **상세 컬럼 확인**: 📁 `db_schema.json` (전체 테이블 261개 상세)
- **네이밍 컨벤션**: `dart_`(공시), `krx_`(거래소), `ecos_`(한은), `vsl_`(가공)

## 4. 데이터 원천 관리
- **DART**, **KIS**, **KRX**, **ECOS**, **네이버 금융** 등

---
> [!NOTE]
> 특정 테이블의 상세 구조가 궁금하다면 `schema/` 디렉토리의 해당 문서를 먼저 읽거나, `db_schema.json`에서 직접 테이블명을 검색하세요.
