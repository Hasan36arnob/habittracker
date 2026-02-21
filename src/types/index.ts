export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  icon: string;
  target: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  value: number;
  completed: boolean;
  notes?: string;
  timestamp: Date;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  streakStartDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  premium: boolean;
  premiumExpiry?: Date;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  notifications: boolean;
  reminderTime: string;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  language: string;
  timezone: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streaks' | 'consistency' | 'milestones' | 'social';
  requirement: number;
  reward?: string;
  unlockedAt?: Date;
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: Date;
  progress: number;
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string;
  streakReminders: boolean;
  weeklySummary: boolean;
  achievementNotifications: boolean;
}

export interface AppState {
  habits: Habit[];
  habitEntries: HabitEntry[];
  streaks: HabitStreak[];
  user: User | null;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  categories: HabitCategory[];
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  EditHabit: {habitId: string};
  Habits: undefined;
  Statistics: undefined;
  Calendar: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Habits: undefined;
  Statistics: undefined;
  Calendar: undefined;
  Profile: undefined;
  Settings: undefined;
};

export const defaultCategories: HabitCategory[] = [
  {id: '1', name: 'Health', color: '#18A999', icon: 'fitness_center', description: 'Physical health and fitness'},
  {id: '2', name: 'Learning', color: '#F7B32B', icon: 'school', description: 'Education and skill development'},
  {id: '3', name: 'Productivity', color: '#FF6B4A', icon: 'work', description: 'Work and efficiency'},
  {id: '4', name: 'Mindfulness', color: '#9C88FF', icon: 'self_improvement', description: 'Mental health and meditation'},
  {id: '5', name: 'Social', color: '#FF9FF3', icon: 'people', description: 'Relationships and social connections'},
  {id: '6', name: 'Creativity', color: '#54A0FF', icon: 'palette', description: 'Art and creative pursuits'},
];