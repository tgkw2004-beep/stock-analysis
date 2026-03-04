import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

/**
 * 달력 날짜 선택기
 * @param {string} value - 선택된 날짜 (YYYY-MM-DD)
 * @param {function} onChange - 날짜 변경 콜백
 * @param {string[]} availableDates - 선택 가능한 날짜 목록
 * @param {object} dateCounts - { 'YYYY-MM-DD': count } 날짜별 건수
 */
export default function DatePicker({ value, onChange, availableDates = [], dateCounts = {} }) {
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(0);
    const [viewMonth, setViewMonth] = useState(0);
    const ref = useRef(null);

    // 선택된 날짜 기준으로 달력 초기화
    useEffect(() => {
        if (value) {
            const d = new Date(value);
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
        }
    }, [value]);

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const availableSet = new Set(availableDates);
    const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
    const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    const pad = (n) => String(n).padStart(2, '0');
    const formatDate = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

    const handleSelect = (dateStr) => {
        if (availableSet.has(dateStr)) {
            onChange(dateStr);
            setOpen(false);
        }
    };

    const count = dateCounts[value] || 0;

    return (
        <div className="datepicker-wrapper" ref={ref}>
            <button className="datepicker-trigger" onClick={() => setOpen(!open)}>
                <Calendar size={15} />
                <span className="datepicker-value">{value || '날짜 선택'}</span>
                {count > 0 && <span className="datepicker-count">{count}건</span>}
            </button>

            {open && (
                <div className="datepicker-dropdown">
                    {/* 헤더 */}
                    <div className="datepicker-header">
                        <button className="datepicker-nav" onClick={prevMonth}><ChevronLeft size={16} /></button>
                        <span className="datepicker-title">{viewYear}년 {MONTHS[viewMonth]}</span>
                        <button className="datepicker-nav" onClick={nextMonth}><ChevronRight size={16} /></button>
                    </div>

                    {/* 요일 */}
                    <div className="datepicker-weekdays">
                        {WEEKDAYS.map(w => <div key={w} className="datepicker-weekday">{w}</div>)}
                    </div>

                    {/* 날짜 그리드 */}
                    <div className="datepicker-grid">
                        {Array.from({ length: firstDay }, (_, i) => (
                            <div key={`empty-${i}`} className="datepicker-cell datepicker-empty" />
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateStr = formatDate(viewYear, viewMonth, day);
                            const isAvailable = availableSet.has(dateStr);
                            const isSelected = dateStr === value;
                            const dayCount = dateCounts[dateStr];

                            return (
                                <div
                                    key={day}
                                    className={`datepicker-cell${isSelected ? ' selected' : ''}${isAvailable ? ' available' : ' disabled'}`}
                                    onClick={() => handleSelect(dateStr)}
                                >
                                    <span className="datepicker-day">{day}</span>
                                    {isAvailable && dayCount && (
                                        <span className="datepicker-dot">{dayCount}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
