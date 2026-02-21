import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useHabits} from '../context/HabitContext';
import {useTheme} from '../context/ThemeContext';
import {getDaysInWeek, getMonthName} from '../utils';

function StatisticsScreen(): React.JSX.Element {
  const {state} = useHabits();
  const {colors} = useTheme();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const {habits, habitEntries, streaks} = state;

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);

    const weekEntries = habitEntries.filter(
      e => new Date(e.date) >= weekStart && e.completed
    );

    const totalCompleted = weekEntries.length;
    const totalHabits = habits.filter(h => h.isActive).length;
    const completionRate = totalHabits > 0 ? Math.round((totalCompleted / (totalHabits * 7)) * 100) : 0;

    const topHabits = habits
      .filter(h => h.isActive)
      .map(h => {
        const hEntries = habitEntries.filter(e => e.habitId === h.id && e.completed);
        return {...h, completedCount: hEntries.length};
      })
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 3);

    const totalStreak = streaks.reduce((sum, s) => sum + s.currentStreak, 0);
    const longestStreak = Math.max(...streaks.map(s => s.longestStreak), 0);

    return {
      totalCompleted,
      totalHabits,
      completionRate,
      topHabits,
      totalStreak,
      longestStreak,
    };
  }, [habits, habitEntries, streaks]);

  const getDayData = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayEntries = habitEntries.filter(e => e.date === dateStr && e.completed);
    return dayEntries.length;
  };

  const weekDays = getDaysInWeek();

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Statistics</Text>
          <View style={styles.rangeSelector}>
            {(['week', 'month', 'year'] as const).map(range => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.rangeButton,
                  timeRange === range && {backgroundColor: colors.accent},
                ]}
                onPress={() => setTimeRange(range)}>
                <Text
                  style={[
                    styles.rangeButtonText,
                    timeRange === range && {color: colors.primary},
                  ]}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="check-circle" size={24} color={colors.success} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {stats.completionRate}%
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Completion</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="fire" size={24} color={colors.warning} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {stats.totalStreak}
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Total Streak</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="trophy" size={24} color={colors.accent} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {stats.longestStreak}
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Best Streak</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="list" size={24} color={colors.primary} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {stats.totalHabits}
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Active Habits</Text>
          </View>
        </View>

        <View style={styles.weekChart}>
          <Text style={[styles.chartTitle, {color: colors.text}]}>This Week's Activity</Text>
          <View style={styles.chartBars}>
            {weekDays.map((date, index) => {
              const count = getDayData(date);
              const maxCount = Math.max(...weekDays.map(d => getDayData(d)), 1);
              const height = (count / maxCount) * 100;

              return (
                <View key={index} style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      {height: `${height}%`, backgroundColor: colors.accent},
                    ]}
                  />
                  <Text style={[styles.dayLabel, {color: colors.textSecondary}]}>
                    {date.toLocaleDateString('en-US', {weekday: 'short'})}
                  </Text>
                  <Text style={[styles.barValue, {color: colors.text}]}>
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.topHabits}>
          <Text style={[styles.chartTitle, {color: colors.text}]}>Top Habits</Text>
          {stats.topHabits.map((habit, index) => (
            <View
              key={habit.id}
              style={[styles.topHabitItem, {borderColor: colors.border}]}>
              <View style={styles.rank}>
                <Text style={[styles.rankText, {color: colors.text}]}>
                  #{index + 1}
                </Text>
              </View>
              <View style={styles.habitInfo}>
                <Icon name={habit.icon} size={16} color={habit.color} />
                <Text style={[styles.habitName, {color: colors.text}]}>
                  {habit.name}
                </Text>
              </View>
              <View style={[styles.habitBadge, {backgroundColor: `${habit.color}22`}]}>
                <Text style={[styles.habitBadgeText, {color: habit.color}]}>
                  {habit.completedCount} completed
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.insights}>
          <Text style={[styles.chartTitle, {color: colors.text}]}>Insights</Text>
          <View style={[styles.insightCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="lightbulb" size={20} color={colors.accent} />
            <View style={styles.insightText}>
              <Text style={[styles.insightTitle, {color: colors.text}]}>
                Consistency is key
              </Text>
              <Text style={[styles.insightSubtitle, {color: colors.textSecondary}]}>
                You've maintained an average completion rate of {stats.completionRate}%. Keep it up!
              </Text>
            </View>
          </View>
          {stats.totalStreak > 0 && (
            <View style={[styles.insightCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
              <Icon name="fire" size={20} color={colors.warning} />
              <View style={styles.insightText}>
                <Text style={[styles.insightTitle, {color: colors.text}]}>
                  Amazing streak!
                </Text>
                <Text style={[styles.insightSubtitle, {color: colors.textSecondary}]}>
                  You've accumulated {stats.totalStreak} days of streaks across all habits.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  rangeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rangeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  weekChart: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBar: {
    width: '60%',
    borderRadius: 4,
    backgroundColor: '#8EC5FC',
  },
  dayLabel: {
    fontSize: 10,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  topHabits: {
    marginBottom: 24,
  },
  topHabitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  rank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  habitInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
  },
  habitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  habitBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  insights: {
    marginBottom: 24,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
  },
  insightText: {
    flex: 1,
    gap: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  insightSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default StatisticsScreen;
