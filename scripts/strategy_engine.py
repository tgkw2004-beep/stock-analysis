"""
Bollinger Band 3대 전략 & 이평선 관통 전략 — 분석 엔진
=====================================================
PAC(Prompt as Code) 기반 전략 판별 엔진.

전략 목록:
  - OMEGA-R  (Rebound)  : 하단밴드 터치 + MACD Histogram 반등
  - ALPHA-S  (Squeeze)  : Bandwidth 수축 극점 + 상방 돌파
  - SIGMA-T  (Trend)    : ADX + MFI 복합 추세 필터
  - Piercing (Special)  : MA3 ↑ MA224 골든크로스 (추세 대반전)

사용법:
  python strategy_engine.py                  # 샘플 데이터로 테스트
  python strategy_engine.py --config config.json  # 커스텀 설정
"""

from __future__ import annotations

import json
import math
import sys
from dataclasses import dataclass, field, asdict
from typing import Any


# ============================================================================
# 1. 설정 관리
# ============================================================================

@dataclass
class Config:
    """사용자 파라미터 바인딩 구조."""
    squeeze_limit: float = 0.75
    adx_threshold: float = 25.0
    mfi_threshold: float = 80.0
    target_date: str = "TODAY"
    market: str = "KOSPI"
    lookback_days: int = 130
    precision: int = 4

    @classmethod
    def from_file(cls, path: str) -> "Config":
        """config.json 파일에서 파라미터를 로드합니다."""
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        params = data.get("parameters", data)
        precision = data.get("output", {}).get("precision", 4)
        return cls(
            squeeze_limit=float(params.get("squeeze_limit", 0.75)),
            adx_threshold=float(params.get("adx_threshold", 25)),
            mfi_threshold=float(params.get("mfi_threshold", 80)),
            target_date=str(params.get("target_date", "TODAY")),
            market=str(params.get("market", "KOSPI")),
            lookback_days=int(params.get("lookback_days", 130)),
            precision=int(precision),
        )


# ============================================================================
# 2. 데이터 모델
# ============================================================================

@dataclass
class StockRecord:
    """SQL 원천 데이터 1행에 대응하는 종목 레코드."""
    ticker: str = ""
    name: str = ""
    close: float = 0.0
    volume: int = 0

    # Bollinger Band
    bb_upper: float = 0.0
    bb_middle: float = 0.0
    bb_lower: float = 0.0
    bb_bandwidth: float = 0.0
    min_bw_6m: float = 0.0
    max_bw_6m: float = 0.0
    hit_lower_3d: int = 0

    # MACD
    macd: float = 0.0
    macd_signal: float = 0.0
    macd_hist: float = 0.0
    macd_hist_prev: float = 0.0

    # ADX & MFI
    adx: float = 0.0
    mfi: float = 0.0

    # 이동평균
    ma3: float = 0.0
    ma224: float = 0.0
    ma3_prev: float = 0.0
    ma224_prev: float = 0.0


@dataclass
class Signal:
    """전략 판별 결과 신호."""
    ticker: str
    name: str
    strategy: str
    score: float
    reason: str


# ============================================================================
# 3. 전략 판별 함수
# ============================================================================

def _r(value: float, precision: int = 4) -> float:
    """소수점 정밀도 반올림 유틸리티."""
    return round(value, precision)


def evaluate_omega_r(record: StockRecord, config: Config) -> Signal | None:
    """
    OMEGA-R (Rebound) 전략 판별.

    조건:
      1. hit_lower_3d >= 1         (최근 3일 내 하단밴드 터치)
      2. macd_hist > macd_hist_prev (MACD Histogram 반등)
      3. macd_hist_prev < 0        (과매도에서 반등)
    """
    if record.hit_lower_3d < 1:
        return None
    if record.macd_hist_prev >= 0:
        return None
    if record.macd_hist <= record.macd_hist_prev:
        return None

    # 스코어: Histogram 변화율(%)
    change = abs(record.macd_hist - record.macd_hist_prev)
    base = abs(record.macd_hist_prev)
    score = _r(change / base * 100, config.precision) if base != 0 else 0.0

    reason = (
        f"최근 3일 내 하단밴드 {record.hit_lower_3d}회 터치, "
        f"MACD Histogram {_r(record.macd_hist_prev, config.precision)} → "
        f"{_r(record.macd_hist, config.precision)} 반등 "
        f"(변화율 {score}%)"
    )

    return Signal(
        ticker=record.ticker,
        name=record.name,
        strategy="OMEGA-R",
        score=score,
        reason=reason,
    )


def evaluate_alpha_s(record: StockRecord, config: Config) -> Signal | None:
    """
    ALPHA-S (Squeeze) 전략 판별.

    수식: Bandwidth_Squeeze = 1 - (Min_BW_6m / Max_BW_6m)
    조건:
      1. Bandwidth_Squeeze >= squeeze_limit
      2. close > bb_upper (상방 돌파)
    """
    if record.max_bw_6m == 0:
        return None

    bandwidth_squeeze = _r(1 - (record.min_bw_6m / record.max_bw_6m), config.precision)

    if bandwidth_squeeze < config.squeeze_limit:
        return None
    if record.close <= record.bb_upper:
        return None

    score = _r(bandwidth_squeeze * 100, config.precision)

    reason = (
        f"Bandwidth Squeeze {bandwidth_squeeze}, "
        f"현재가 상단밴드 돌파 "
        f"(종가 {record.close:,.0f} > BB상단 {record.bb_upper:,.0f})"
    )

    return Signal(
        ticker=record.ticker,
        name=record.name,
        strategy="ALPHA-S",
        score=score,
        reason=reason,
    )


def evaluate_sigma_t(record: StockRecord, config: Config) -> Signal | None:
    """
    SIGMA-T (Trend) 전략 판별.

    조건:
      1. ADX >= adx_threshold (기본 25)
      2. MFI >= mfi_threshold (기본 80)
      3. close > bb_middle    (BB 중심선 상회)
    """
    if record.adx < config.adx_threshold:
        return None
    if record.mfi < config.mfi_threshold:
        return None
    if record.close <= record.bb_middle:
        return None

    # 스코어: ADX 60% + MFI 40% 가중평균
    score = _r((record.adx / 100 * 0.6 + record.mfi / 100 * 0.4) * 100, config.precision)

    reason = (
        f"ADX {_r(record.adx, config.precision)} (≥{config.adx_threshold}), "
        f"MFI {_r(record.mfi, config.precision)} (≥{config.mfi_threshold}), "
        f"종가 {record.close:,.0f} > BB중심 {record.bb_middle:,.0f}"
    )

    return Signal(
        ticker=record.ticker,
        name=record.name,
        strategy="SIGMA-T",
        score=score,
        reason=reason,
    )


def evaluate_piercing(record: StockRecord, config: Config) -> Signal | None:
    """
    Piercing (이평선 관통) 전략 판별.

    조건:
      1. ma3_prev <= ma224_prev  (전일 MA3 ≤ MA224)
      2. ma3      >  ma224       (당일 MA3 > MA224 — 상향 돌파)
    """
    if record.ma3_prev > record.ma224_prev:
        return None
    if record.ma3 <= record.ma224:
        return None

    # 스코어: 돌파 괴리율(bps)
    gap_bps = _r((record.ma3 - record.ma224) / record.ma224 * 10000, config.precision) if record.ma224 != 0 else 0.0

    reason = (
        f"MA3 골든크로스 발생 — "
        f"전일 MA3({_r(record.ma3_prev, 2)}) ≤ MA224({_r(record.ma224_prev, 2)}) → "
        f"당일 MA3({_r(record.ma3, 2)}) > MA224({_r(record.ma224, 2)}), "
        f"괴리율 {gap_bps}bps"
    )

    return Signal(
        ticker=record.ticker,
        name=record.name,
        strategy="Piercing",
        score=gap_bps,
        reason=reason,
    )


# ============================================================================
# 4. 분석 엔진 (전략 통합 실행)
# ============================================================================

# 전략 우선순위 순서대로 평가 함수 리스트
STRATEGY_EVALUATORS = [
    evaluate_omega_r,   # Priority 1
    evaluate_piercing,  # Priority 2
    evaluate_alpha_s,   # Priority 3
    evaluate_sigma_t,   # Priority 4
]


def analyze(records: list[StockRecord], config: Config) -> dict[str, Any]:
    """
    전체 종목 리스트에 대해 4대 전략을 판별하고 JSON 구조를 반환합니다.

    Args:
        records: SQL 쿼리 결과를 StockRecord로 변환한 리스트
        config: 사용자 파라미터 설정

    Returns:
        분석 결과 JSON 딕셔너리
    """
    signals: list[dict[str, Any]] = []
    strategy_counts: dict[str, int] = {
        "OMEGA-R": 0,
        "Piercing": 0,
        "ALPHA-S": 0,
        "SIGMA-T": 0,
    }

    for record in records:
        for evaluator in STRATEGY_EVALUATORS:
            signal = evaluator(record, config)
            if signal is not None:
                signals.append({
                    "ticker": signal.ticker,
                    "name": signal.name,
                    "strategy": signal.strategy,
                    "score": signal.score,
                    "reason": signal.reason,
                })
                strategy_counts[signal.strategy] += 1

    # 전략 우선순위 + 스코어 내림차순 정렬
    priority_order = {"OMEGA-R": 0, "Piercing": 1, "ALPHA-S": 2, "SIGMA-T": 3}
    signals.sort(key=lambda s: (priority_order.get(s["strategy"], 99), -s["score"]))

    result = {
        "analysis_date": config.target_date,
        "market": config.market,
        "parameters": {
            "squeeze_limit": config.squeeze_limit,
            "adx_threshold": config.adx_threshold,
            "mfi_threshold": config.mfi_threshold,
        },
        "results": signals,
        "summary": {
            "total_scanned": len(records),
            "signals_found": len(signals),
            "by_strategy": strategy_counts,
        },
    }

    return result


# ============================================================================
# 5. SQL 템플릿 파라미터 바인딩
# ============================================================================

def bind_sql_template(template_path: str, config: Config) -> str:
    """
    SQL 템플릿 파일의 ${parameter} 변수를 config 값으로 치환합니다.

    Args:
        template_path: sql_template.sql 파일 경로
        config: 사용자 파라미터

    Returns:
        변수가 바인딩된 SQL 문자열
    """
    with open(template_path, "r", encoding="utf-8") as f:
        sql = f.read()

    bindings = {
        "${target_date}": config.target_date,
        "${market}": config.market,
        "${lookback_days}": str(config.lookback_days),
    }

    for placeholder, value in bindings.items():
        sql = sql.replace(placeholder, value)

    return sql


# ============================================================================
# 6. 테스트 실행 (샘플 데이터)
# ============================================================================

def _create_sample_data() -> list[StockRecord]:
    """전략별 조건을 충족하는 샘플 데이터를 생성합니다."""
    return [
        # OMEGA-R 해당 종목: 하단밴드 터치 + MACD Histogram 반등
        StockRecord(
            ticker="005930", name="삼성전자",
            close=71500, volume=15000000,
            bb_upper=74000, bb_middle=72000, bb_lower=70000,
            bb_bandwidth=0.0556, min_bw_6m=0.02, max_bw_6m=0.08,
            hit_lower_3d=1,
            macd=150, macd_signal=200,
            macd_hist=-0.28, macd_hist_prev=-0.52,
            adx=18, mfi=45,
            ma3=71200, ma224=70800,
            ma3_prev=70500, ma224_prev=70900,
        ),
        # ALPHA-S 해당 종목: Bandwidth Squeeze + 상방 돌파
        StockRecord(
            ticker="035720", name="카카오",
            close=58200, volume=5000000,
            bb_upper=57800, bb_middle=55000, bb_lower=52200,
            bb_bandwidth=0.1018, min_bw_6m=0.015, max_bw_6m=0.12,
            hit_lower_3d=0,
            macd=320, macd_signal=280,
            macd_hist=40, macd_hist_prev=25,
            adx=20, mfi=60,
            ma3=57500, ma224=54000,
            ma3_prev=56800, ma224_prev=54100,
        ),
        # SIGMA-T 해당 종목: ADX ≥ 25 & MFI ≥ 80
        StockRecord(
            ticker="000660", name="SK하이닉스",
            close=135000, volume=8000000,
            bb_upper=140000, bb_middle=130000, bb_lower=120000,
            bb_bandwidth=0.1538, min_bw_6m=0.05, max_bw_6m=0.20,
            hit_lower_3d=0,
            macd=1200, macd_signal=1000,
            macd_hist=200, macd_hist_prev=180,
            adx=32, mfi=85,
            ma3=134000, ma224=125000,
            ma3_prev=133000, ma224_prev=124800,
        ),
        # Piercing 해당 종목: MA3 골든크로스 MA224
        StockRecord(
            ticker="051910", name="LG화학",
            close=520000, volume=600000,
            bb_upper=540000, bb_middle=510000, bb_lower=480000,
            bb_bandwidth=0.1176, min_bw_6m=0.04, max_bw_6m=0.15,
            hit_lower_3d=0,
            macd=2500, macd_signal=2600,
            macd_hist=-100, macd_hist_prev=-150,
            adx=22, mfi=55,
            ma3=508500, ma224=508000,
            ma3_prev=507800, ma224_prev=508100,
        ),
        # 어떤 전략에도 해당하지 않는 종목
        StockRecord(
            ticker="006400", name="삼성SDI",
            close=450000, volume=300000,
            bb_upper=470000, bb_middle=455000, bb_lower=440000,
            bb_bandwidth=0.0659, min_bw_6m=0.03, max_bw_6m=0.10,
            hit_lower_3d=0,
            macd=500, macd_signal=520,
            macd_hist=-20, macd_hist_prev=-15,
            adx=15, mfi=50,
            ma3=449000, ma224=460000,
            ma3_prev=448000, ma224_prev=461000,
        ),
    ]


def main():
    """메인 실행: 샘플 데이터로 전략 분석 테스트."""
    # 설정 로드 (CLI 인자 또는 기본값)
    config = Config()
    if "--config" in sys.argv:
        idx = sys.argv.index("--config")
        if idx + 1 < len(sys.argv):
            config = Config.from_file(sys.argv[idx + 1])

    print("=" * 70)
    print("  Bollinger Band 3대 전략 & 이평선 관통 전략 — PAC 분석 엔진")
    print("=" * 70)
    print(f"\n📋 설정: squeeze_limit={config.squeeze_limit}, "
          f"adx_threshold={config.adx_threshold}, "
          f"mfi_threshold={config.mfi_threshold}\n")

    # 샘플 데이터 생성
    records = _create_sample_data()

    # 분석 실행
    result = analyze(records, config)

    # JSON 출력
    output_json = json.dumps(result, ensure_ascii=False, indent=2)
    print(output_json)

    # 요약 출력
    summary = result["summary"]
    print(f"\n{'=' * 70}")
    print(f"📊 분석 요약")
    print(f"   스캔 종목 수 : {summary['total_scanned']}")
    print(f"   신호 발견 수 : {summary['signals_found']}")
    for strategy, count in summary["by_strategy"].items():
        marker = "✅" if count > 0 else "⬜"
        print(f"   {marker} {strategy:10s} : {count}건")
    print(f"{'=' * 70}")

    return result


if __name__ == "__main__":
    main()
