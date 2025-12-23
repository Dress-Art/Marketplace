'use client';

import { useState, useMemo } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isBefore,
    startOfDay
} from 'date-fns';
import { fr } from 'date-fns/locale';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';

interface CalendarProps {
    selected?: Date;
    onSelect: (date: Date | undefined) => void;
    className?: string;
}

export default function Calendar({ selected, onSelect, className = '' }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // Use useMemo to prevent hydration mismatch - calculate once per mount
    const today = useMemo(() => startOfDay(new Date()), []);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
        <div className={`p-4 bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    disabled={isSameMonth(currentMonth, today) && isBefore(currentMonth, today)}
                >
                    <ArrowLeftIcon size={20} />
                </button>
                <h2 className="text-lg font-bold capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </h2>
                <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer rotate-180"
                >
                    <ArrowLeftIcon size={20} />
                </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, dayIdx) => {
                    const isSelected = selected ? isSameDay(day, selected) : false;
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isDisabled = isBefore(day, today);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => !isDisabled && onSelect(day)}
                            disabled={isDisabled}
                            className={`
                                h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all mx-auto
                                ${!isCurrentMonth ? 'text-gray-300' : ''}
                                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                                ${isSelected ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md' : ''}
                                ${isToday && !isSelected ? 'border border-gray-900 font-bold' : ''}
                            `}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
