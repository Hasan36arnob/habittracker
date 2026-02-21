import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Habit, HabitEntry, HabitStreak, AppState, defaultCategories} from '../types';

// Action types
type HabitAction =
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_ERROR'; payload: string | null}
  | {type: 'LOAD_DATA'; payload: Partial<AppState>}
  | {type: 'ADD_HABIT'; payload: Habit}
  | {type: 'UPDATE_HABIT'; payload: Habit}
  | {type: 'DELETE_HABIT'; payload: string}
  | {type: 'ADD_HABIT_ENTRY'; payload: HabitEntry}
  | {type: 'UPDATE_HABIT_ENTRY'; payload: HabitEntry}
  | {type: 'DELETE_HABIT_ENTRY'; payload: string}
  | {type: 'UPDATE_STREAK'; payload: HabitStreak}
  | {type: 'RESET_DATA'};

// Initial state
const initialState: AppState = {
  habits: [],
  habitEntries: [],
  streaks: [],
  user: null,
  achievements: [],
  userAchievements: [],
  categories: defaultCategories,
  isLoading: true,
  error: null,
};

// Reducer
function habitReducer(state: AppState, action: HabitAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_ERROR':
      return {...state, error: action.payload, isLoading: false};
    case 'LOAD_DATA':
      return {...state, ...action.payload, isLoading: false, error: null};
    case 'ADD_HABIT':
      return {...state, habits: [...state.habits, action.payload]};
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        habitEntries: state.habitEntries.filter(entry => entry.habitId !== action.payload),
        streaks: state.streaks.filter(streak => streak.habitId !== action.payload),
      };
    case 'ADD_HABIT_ENTRY':
      return {...state, habitEntries: [...state.habitEntries, action.payload]};
    case 'UPDATE_HABIT_ENTRY':
      return {
        ...state,
        habitEntries: state.habitEntries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'DELETE_HABIT_ENTRY':
      return {
        ...state,
        habitEntries: state.habitEntries.filter(entry => entry.id !== action.payload),
      };
    case 'UPDATE_STREAK':
      const existingStreakIndex = state.streaks.findIndex(
        streak => streak.habitId === action.payload.habitId
      );
      if (existingStreakIndex >= 0) {
        const updatedStreaks = [...state.streaks];
        updatedStreaks[existingStreakIndex] = action.payload;
        return {...state, streaks: updatedStreaks};
      } else {
        return {...state, streaks: [...state.streaks, action.payload]};
      }
    case 'RESET_DATA':
      return {...initialState, isLoading: false};
    default:
      return state;
  }
}

// Context
interface HabitContextType {
  state: AppState;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  addHabitEntry: (entry: Omit<HabitEntry, 'id' | 'timestamp'>) => Promise<void>;
  updateHabitEntry: (entry: HabitEntry) => Promise<void>;
  deleteHabitEntry: (entryId: string) => Promise<void>;
  getHabitEntries: (habitId: string, date?: string) => HabitEntry[];
  getHabitStreak: (habitId: string) => HabitStreak | undefined;
  calculateStreak: (habitId: string) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  resetData: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

// Provider component
interface HabitProviderProps {
  children: ReactNode;
}

export function HabitProvider({children}: HabitProviderProps) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    if (!state.isLoading) {
      saveData();
    }
  }, [state.habits, state.habitEntries, state.streaks, state.userAchievements]);

  const loadData = async () => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});

      const [
        habitsData,
        entriesData,
        streaksData,
        userData,
        achievementsData,
      ] = await Promise.all([
        AsyncStorage.getItem('habits'),
        AsyncStorage.getItem('habitEntries'),
        AsyncStorage.getItem('streaks'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('userAchievements'),
      ]);

      const habits = habitsData ? JSON.parse(habitsData).map((h: any) => ({
        ...h,
        createdAt: new Date(h.createdAt),
        updatedAt: new Date(h.updatedAt),
      })) : [];

      const habitEntries = entriesData ? JSON.parse(entriesData).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      })) : [];

      const streaks = streaksData ? JSON.parse(streaksData) : [];
      const user = userData ? JSON.parse(userData) : null;
      const userAchievements = achievementsData ? JSON.parse(achievementsData) : [];

      dispatch({
        type: 'LOAD_DATA',
        payload: {habits, habitEntries, streaks, user, userAchievements},
      });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({type: 'SET_ERROR', payload: 'Failed to load data'});
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('habits', JSON.stringify(state.habits)),
        AsyncStorage.setItem('habitEntries', JSON.stringify(state.habitEntries)),
        AsyncStorage.setItem('streaks', JSON.stringify(state.streaks)),
        AsyncStorage.setItem('user', JSON.stringify(state.user)),
        AsyncStorage.setItem('userAchievements', JSON.stringify(state.userAchievements)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
      dispatch({type: 'SET_ERROR', payload: 'Failed to save data'});
    }
  };

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const habit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({type: 'ADD_HABIT', payload: habit});

    // Initialize streak for new habit
    const initialStreak: HabitStreak = {
      habitId: habit.id,
      currentStreak: 0,
      longestStreak: 0,
    };
    dispatch({type: 'UPDATE_STREAK', payload: initialStreak});
  };

  const updateHabit = async (habit: Habit) => {
    const updatedHabit = {...habit, updatedAt: new Date()};
    dispatch({type: 'UPDATE_HABIT', payload: updatedHabit});
  };

  const deleteHabit = async (habitId: string) => {
    dispatch({type: 'DELETE_HABIT', payload: habitId});
  };

  const addHabitEntry = async (entryData: Omit<HabitEntry, 'id' | 'timestamp'>) => {
    const entry: HabitEntry = {
      ...entryData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    dispatch({type: 'ADD_HABIT_ENTRY', payload: entry});

    // Recalculate streak after adding entry
    await calculateStreak(entryData.habitId);
  };

  const updateHabitEntry = async (entry: HabitEntry) => {
    dispatch({type: 'UPDATE_HABIT_ENTRY', payload: entry});
    await calculateStreak(entry.habitId);
  };

  const deleteHabitEntry = async (entryId: string) => {
    const entry = state.habitEntries.find(e => e.id === entryId);
    dispatch({type: 'DELETE_HABIT_ENTRY', payload: entryId});

    if (entry) {
      await calculateStreak(entry.habitId);
    }
  };

  const getHabitEntries = (habitId: string, date?: string): HabitEntry[] => {
    let entries = state.habitEntries.filter(entry => entry.habitId === habitId);

    if (date) {
      entries = entries.filter(entry => entry.date === date);
    }

    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getHabitStreak = (habitId: string): HabitStreak | undefined => {
    return state.streaks.find(streak => streak.habitId === habitId);
  };

  const calculateStreak = async (habitId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;

    const entries = getHabitEntries(habitId);
    const today = new Date().toISOString().split('T')[0];

    // Get unique completed dates
    const completedDates = [...new Set(
      entries
        .filter(entry => entry.completed)
        .map(entry => entry.date)
        .sort()
    )];

    if (completedDates.length === 0) {
      const streak: HabitStreak = {
        habitId,
        currentStreak: 0,
        longestStreak: 0,
      };
      dispatch({type: 'UPDATE_STREAK', payload: streak});
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (completedDates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dateStr of completedDates) {
      const currentDate = new Date(dateStr);

      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      prevDate = currentDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    const streak: HabitStreak = {
      habitId,
      currentStreak,
      longestStreak,
      lastCompletedDate: completedDates[completedDates.length - 1],
      streakStartDate: currentStreak > 0 ?
        new Date(checkDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
        undefined,
    };

    dispatch({type: 'UPDATE_STREAK', payload: streak});
  };

  const exportData = async (): Promise<string> => {
    const exportData = {
      habits: state.habits,
      habitEntries: state.habitEntries,
      streaks: state.streaks,
      user: state.user,
      userAchievements: state.userAchievements,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  };

  const importData = async (data: string) => {
    try {
      const importData = JSON.parse(data);

      if (!importData.habits || !Array.isArray(importData.habits)) {
        throw new Error('Invalid import data format');
      }

      // Convert date strings back to Date objects
      const habits = importData.habits.map((h: any) => ({
        ...h,
        createdAt: new Date(h.createdAt),
        updatedAt: new Date(h.updatedAt),
      }));

      const habitEntries = importData.habitEntries?.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      })) || [];

      dispatch({
        type: 'LOAD_DATA',
        payload: {
          habits,
          habitEntries,
          streaks: importData.streaks || [],
          user: importData.user || null,
          userAchievements: importData.userAchievements || [],
        },
      });
    } catch (error) {
      throw new Error('Failed to import data: ' + (error as Error).message);
    }
  };

  const resetData = async () => {
    await AsyncStorage.multiRemove(['habits', 'habitEntries', 'streaks', 'user', 'userAchievements']);
    dispatch({type: 'RESET_DATA'});
  };

  const value: HabitContextType = {
    state,
    addHabit,
    updateHabit,
    deleteHabit,
    addHabitEntry,
    updateHabitEntry,
    deleteHabitEntry,
    getHabitEntries,
    getHabitStreak,
    calculateStreak,
    exportData,
    importData,
    resetData,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

// Hook to use the context
export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
