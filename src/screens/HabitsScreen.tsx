import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useHabits} from '../context/HabitContext';
import {useTheme} from '../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {formatDate} from '../utils';

function HabitsScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {state, deleteHabit, calculateStreak} = useHabits();
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const {habits, isLoading} = state;

  const activeHabits = useMemo(() => habits.filter(h => h.isActive), [habits]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await calculateStreak(activeHabits[0]?.id);
    setTimeout(() => setRefreshing(false), 1000);
  }, [activeHabits, calculateStreak]);

  const getStreak = (habitId: string) => {
    const streak = state.streaks.find(s => s.habitId === habitId);
    return streak?.currentStreak || 0;
  };

  const renderHabit = ({item}: {item: typeof habits[0]}) => {
    const streak = getStreak(item.id);

    return (
      <TouchableOpacity
        style={[styles.habitCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
        onPress={() => navigation.navigate('EditHabit' as never, {habitId: item.id} as never)}
        activeOpacity={0.7}>
        <View style={styles.habitHeader}>
          <View style={styles.habitInfo}>
            <View style={styles.habitTitleRow}>
              <Icon name={item.icon} size={20} color={item.color} />
              <Text style={[styles.habitName, {color: colors.text}]}>{item.name}</Text>
            </View>
            <Text style={[styles.habitMeta, {color: colors.textSecondary}]}>
              {item.category} • {streak > 0 ? `${streak} day streak` : 'New habit'}
            </Text>
          </View>
          <View style={[styles.badge, {backgroundColor: `${item.color}22`}]}>
            <Text style={[styles.badgeText, {color: item.color}]}>
              {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.habitFooter}>
          <Text style={[styles.footerText, {color: colors.textSecondary}]}>
            {item.target} {item.unit} {item.frequency}
          </Text>
          <TouchableOpacity
            style={[styles.deleteButton, {borderColor: colors.error}]}
            onPress={async () => {
              await deleteHabit(item.id);
            }}>
            <Icon name="delete" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {color: colors.text}]}>Loading habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <FlatList
        data={activeHabits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={[styles.emptyState, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="list" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, {color: colors.text}]}>No habits yet</Text>
            <Text style={[styles.emptySubtitle, {color: colors.textSecondary}]}>
              Add habits to track your progress
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, {backgroundColor: colors.accent}]}
              onPress={() => navigation.navigate('AddHabit' as never)}>
              <Text style={[styles.primaryButtonText, {color: colors.primary}]}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, {color: colors.text}]}>
              Your Habits ({activeHabits.length})
            </Text>
            <TouchableOpacity
              style={[styles.addButton, {borderColor: colors.accent}]}
              onPress={() => navigation.navigate('AddHabit' as never)}>
              <Icon name="add" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
    gap: 4,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '700',
  },
  habitMeta: {
    fontSize: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  habitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  footerText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 18,
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
});

export default HabitsScreen;
