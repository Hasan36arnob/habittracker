import React, {useMemo} from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Habit = {
  id: string;
  name: string;
  category: string;
  streak: number;
  progress: number;
  target: number;
  color: string;
};

const habits: Habit[] = [
  {
    id: '1',
    name: 'Deep Work',
    category: 'Focus',
    streak: 24,
    progress: 90,
    target: 120,
    color: '#FF6B4A',
  },
  {
    id: '2',
    name: 'Workout',
    category: 'Health',
    streak: 12,
    progress: 42,
    target: 60,
    color: '#18A999',
  },
  {
    id: '3',
    name: 'Read 20 Pages',
    category: 'Learning',
    streak: 31,
    progress: 16,
    target: 20,
    color: '#F7B32B',
  },
];

const weekData = [1, 1, 1, 0, 1, 1, 0];
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function App(): React.JSX.Element {
  const completionRate = useMemo(() => {
    const total = habits.reduce((sum, habit) => sum + habit.target, 0);
    const done = habits.reduce((sum, habit) => sum + habit.progress, 0);
    return Math.min(100, Math.round((done / total) * 100));
  }, []);

  const headingFont = Platform.select({
    ios: 'Georgia',
    android: 'sans-serif-condensed',
    default: 'serif',
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0E1C36" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={[styles.kicker, {fontFamily: headingFont}]}>TODAY</Text>
          <Text style={[styles.heroTitle, {fontFamily: headingFont}]}>
            Habit Momentum
          </Text>
          <Text style={styles.heroSubtitle}>
            You are building consistency. Keep your chain alive.
          </Text>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>Completion</Text>
              <Text style={styles.scoreValue}>{completionRate}%</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View>
              <Text style={styles.scoreLabel}>Active Habits</Text>
              <Text style={styles.scoreValue}>{habits.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Weekly Streak</Text>
          <View style={styles.weekRow}>
            {weekData.map((value, index) => (
              <View key={`${dayLabels[index]}-${index}`} style={styles.dayWrap}>
                <View
                  style={[
                    styles.dayDot,
                    value ? styles.dayDotActive : styles.dayDotInactive,
                  ]}
                />
                <Text style={styles.dayLabel}>{dayLabels[index]}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Habits</Text>
        {habits.map(habit => {
          const ratio = Math.min(1, habit.progress / habit.target);
          const pct = Math.round(ratio * 100);
          return (
            <View key={habit.id} style={styles.habitCard}>
              <View style={styles.habitHeader}>
                <View>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitMeta}>
                    {habit.category} • {habit.streak} day streak
                  </Text>
                </View>
                <View style={[styles.badge, {backgroundColor: `${habit.color}22`}]}>
                  <Text style={[styles.badgeText, {color: habit.color}]}>
                    {pct}%
                  </Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${pct}%`, backgroundColor: habit.color},
                  ]}
                />
              </View>
              <View style={styles.habitFooter}>
                <Text style={styles.footerText}>
                  {habit.progress} / {habit.target} min
                </Text>
                <TouchableOpacity style={[styles.actionButton, {borderColor: habit.color}]}>
                  <Text style={[styles.actionText, {color: habit.color}]}>
                    Mark Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B162A',
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
    backgroundColor: '#0E1C36',
    borderWidth: 1,
    borderColor: '#1E3A5F',
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
    backgroundColor: '#2A4E7A',
  },
  panel: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#122440',
    borderWidth: 1,
    borderColor: '#213D64',
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
    backgroundColor: '#2A3C5D',
    borderWidth: 1,
    borderColor: '#415C85',
  },
  dayLabel: {
    color: '#A9BDD8',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#DCE8F8',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  habitCard: {
    borderRadius: 18,
    padding: 15,
    backgroundColor: '#102038',
    borderWidth: 1,
    borderColor: '#213D64',
    gap: 10,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  habitMeta: {
    marginTop: 2,
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
    backgroundColor: '#243E63',
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

export default App;
