import {Habit, HabitEntry} from '../types';

export const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getWeekEnd = (date: Date = new Date()): Date => {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getDaysInWeek = (date: Date = new Date()): Date[] => {
  const days: Date[] = [];
  const start = getWeekStart(date);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthIndex] || '';
};

export const calculateCompletionPercentage = (
  habit: Habit,
  entries: HabitEntry[],
  date: Date = new Date(),
): number => {
  const dateStr = date.toISOString().split('T')[0];
  const dayEntries = entries.filter(e => e.habitId === habit.id && e.date === dateStr);
  const totalValue = dayEntries.reduce((sum, e) => sum + e.value, 0);
  return Math.min(100, Math.round((totalValue / habit.target) * 100));
};

export const calculateStreak = (entries: HabitEntry[], habitId: string): {current: number; longest: number} => {
  const habitEntries = entries.filter(e => e.habitId === habitId && e.completed);
  const uniqueDates = [...new Set(habitEntries.map(e => e.date))].sort().reverse();
  
  if (uniqueDates.length === 0) return {current: 0, longest: 0};
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
      
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diff = (prevDate.getTime() - currDate.getTime()) / 86400000;
    
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
  
  return {current: currentStreak, longest: longestStreak};
};

export const getProgressColor = (percentage: number, colors: {success: string; warning: string; error: string}): string => {
  if (percentage >= 100) return colors.success;
  if (percentage >= 75) return colors.warning;
  return colors.error;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
