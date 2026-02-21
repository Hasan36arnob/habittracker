import React, {useMemo, useEffect} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useHabits} from '../context/HabitContext';
import {useTheme} from '../context/ThemeContext';
import {Habit} from '../types';

function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {state, addHabitEntry, getHabitStreak} = useHabits();
  const {colors, isDark} = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const {habits, habitEntries, streaks, isLoading} = state;

  const completionRate = useMemo(() => {
    if (habits.length === 0) return 0;

    const total = habits.reduce((sum, habit) => sum + habit.target, 0);
    const done = habitEntries
      .filter(entry => entry.completed && entry.date === new Date().toISOString().split('T')[0])
      .reduce((sum, entry) => sum + entry.value, 0);

    return Math.min(100, Math.round((done / total) * 100));
  }, [habits, habitEntries]);

  const activeHabits = habits.filter(habit => habit.isActive);
  const todayEntries = habitEntries.filter(
    entry => entry.date === new Date().toISOString().split('T')[0]
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // In a real app, you might refetch data here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleMarkDone = async (habit: Habit) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = todayEntries.find(entry => entry.habitId === habit.id);

      if (existingEntry) {
        // Toggle completion
        await addHabitEntry({
          habitId: habit.id,
          date: today,
          value: existingEntry.completed ? 0 : habit.target,
          completed: !existingEntry.completed,
        });
      } else {
        // Create new entry
        await addHabitEntry({
          habitId: habit.id,
          date: today,
          value: habit.target,
          completed: true,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit progress');
    }
  };

  const getTodayProgress = (habit: Habit) => {
    const entry = todayEntries.find(e => e.habitId === habit.id);
    return entry ? entry.value : 0;
  };

  const getTodayCompletion = (habit: Habit) => {
    const entry = todayEntries.find(e => e.habitId === habit.id);
    return entry ? entry.completed : false;
  };

  const headingFont = Platform.select({
    ios: 'Georgia',
    android: 'sans-serif-condensed',
    default: 'serif',
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {color: colors.text}]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[styles.heroCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.kicker, {fontFamily: headingFont, color: colors.accent}]}>TODAY</Text>
          <Text style={[styles.heroTitle, {fontFamily: headingFont, color: colors.text}]}>
            Habit Momentum
          </Text>
          <Text style={[styles.heroSubtitle, {color: colors.textSecondary}]}>
            You are building consistency. Keep your chain alive.
          </Text>
          <View style={styles.scoreRow}>
            <View>
              <Text style={[styles.scoreLabel, {color: colors.textSecondary}]}>Completion</Text>
              <Text style={[styles.scoreValue, {color: colors.text}]}>{completionRate}%</Text>
            </View>
            <View style={[styles.scoreDivider, {backgroundColor: colors.border}]} />
            <View>
              <Text style={[styles.scoreLabel, {color: colors.textSecondary}]}>Active Habits</Text>
              <Text style={[styles.scoreValue, {color: colors.text}]}>{activeHabits.length}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.panel, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.panelTitle, {color: colors.text}]}>Weekly Streak</Text>
          <View style={styles.weekRow}>
            {Array.from({length: 7}, (_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const dateStr = date.toISOString().split('T')[0];
              const hasCompleted = habitEntries.some(
                entry => entry.date === dateStr && entry.completed
              );
              const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

              return (
                <View key={dateStr} style={styles.dayWrap}>
                  <View
                    style={[
                      styles.dayDot,
                      hasCompleted ? styles.dayDotActive : [styles.dayDotInactive, {backgroundColor: colors.border}],
                    ]}
                  />
                  <Text style={[styles.dayLabel, {color: colors.textSecondary}]}>{dayLabels[index]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Your Habits</Text>
          <TouchableOpacity
            style={[styles.addButton, {borderColor: colors.accent}]}
            onPress={() => navigation.navigate('AddHabit' as never)}>
            <Icon name="add" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {activeHabits.length === 0 ? (
          <View style={[styles.emptyState, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="psychology" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, {color: colors.text}]}>No habits yet</Text>
            <Text style={[styles.emptySubtitle, {color: colors.textSecondary}]}>
              Start building your daily routine by adding your first habit
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, {backgroundColor: colors.accent}]}
              onPress={() => navigation.navigate('AddHabit' as never)}>
              <Text style={[styles.primaryButtonText, {color: colors.primary}]}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activeHabits.map(habit => {
            const progress = getTodayProgress(habit);
            const ratio = Math.min(1, progress / habit.target);
            const pct = Math.round(ratio * 100);
            const isCompleted = getTodayCompletion(habit);
            const streak = getHabitStreak(habit.id);

            return (
              <TouchableOpacity
                key={habit.id}
                style={[styles.habitCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
                onPress={() => navigation.navigate('EditHabit' as never, {habitId: habit.id} as never)}>
                <View style={styles.habitHeader}>
                  <View style={styles.habitInfo}>
                    <View style={styles.habitTitleRow}>
                      <Icon name={habit.icon} size={20} color={habit.color} />
                      <Text style={[styles.habitName, {color: colors.text}]}>{habit.name}</Text>
                    </View>
                    <Text style={[styles.habitMeta, {color: colors.textSecondary}]}>
                      {habit.category} • {streak?.currentStreak || 0} day streak
                    </Text>
                  </View>
                  <View style={[styles.badge, {backgroundColor: `${habit.color}22`}]}>
                    <Text style={[styles.badgeText, {color: habit.color}]}>
                      {pct}%
                    </Text>
                  </View>
                </View>
                <View style={[styles.progressBar, {backgroundColor: colors.border}]}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${pct}%`, backgroundColor: habit.color},
                    ]}
                  />
                </View>
                <View style={styles.habitFooter}>
                  <Text style={[styles.footerText, {color: colors.textSecondary}]}>
                    {progress} / {habit.target} {habit.unit}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      {borderColor: habit.color},
                      isCompleted && {backgroundColor: habit.color}
                    ]}
                    onPress={() => handleMarkDone(habit)}>
                    <Text style={[
                      styles.actionText,
                      {color: isCompleted ? colors.primary : habit.color}
                    ]}>
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    gap: 14,
  },
  heroCard: {
    marginTop: 12,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  kicker: {
    color: '#8EC5FC',
    fontSize: 12,
    letterSpacing: 2.4,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 33,
    lineHeight: 38,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: '#B7C8E0',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  scoreRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreLabel: {
    color: '#9EB3CF',
    fontSize: 12,
  },
  scoreValue: {
    marginTop: 3,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  scoreDivider: {
    width: 1,
    height: 38,
  },
  panel: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  panelTitle: {
    color: '#D6E4F5',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayWrap: {
    alignItems: 'center',
    gap: 6,
  },
  dayDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  dayDotActive: {
    backgroundColor: '#36D399',
    borderWidth: 4,
    borderColor: '#A3F5D3',
  },
  dayDotInactive: {
    borderWidth: 1,
  },
  dayLabel: {
    color: '#A9BDD8',
    fontSize: 11,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#DCE8F8',
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitCard: {
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    gap: 10,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  habitInfo: {
    flex: 1,
    gap: 2,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  habitMeta: {
    color: '#9FB4D0',
    fontSize: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  habitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#BDD0E8',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HomeScreen;