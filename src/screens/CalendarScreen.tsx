import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useHabits} from '../context/HabitContext';
import {useTheme} from '../context/ThemeContext';
import {formatDate, getDaysInWeek, getMonthName} from '../utils';

function CalendarScreen(): React.JSX.Element {
  const {state} = useHabits();
  const {colors} = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const daysInWeek = useMemo(() => getDaysInWeek(currentDate), [currentDate]);
  const monthName = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const completedHabits = state.habitEntries.filter(
      e => e.date === dateStr && e.completed
    ).length;
    const totalHabits = state.habits.filter(h => h.isActive).length;
    const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    if (percentage === 100) return 'full';
    if (percentage >= 50) return 'partial';
    if (percentage > 0) return 'some';
    return 'empty';
  };

  const getDayColor = (status: string) => {
    switch (status) {
      case 'full': return colors.success;
      case 'partial': return colors.warning;
      case 'some': return colors.accent;
      default: return colors.border;
    }
  };

  const renderMonthView = () => {
    const days = [];
    const firstDay = new Date(year, currentDate.getMonth(), 1);
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const status = getDayStatus(date);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && {borderColor: colors.accent, borderWidth: 2},
          ]}
          activeOpacity={0.7}>
          <View
            style={[
              styles.dayNumber,
              {color: isToday ? colors.accent : colors.textSecondary},
            ]}>
            {day}
          </View>
          <View
            style={[
              styles.dayIndicator,
              {backgroundColor: getDayColor(status)},
            ]}
          />
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToToday}>
            <Text style={[styles.todayButton, {color: colors.accent}]}>
              Today
            </Text>
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <TouchableOpacity onPress={viewMode === 'month' ? prevMonth : prevWeek}>
              <Icon name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.monthYear, {color: colors.text}]}>
              {viewMode === 'month' ? `${monthName} ${year}` : `Week of ${formatDate(daysInWeek[0])}`}
            </Text>
            <TouchableOpacity onPress={viewMode === 'month' ? nextMonth : nextWeek}>
              <Icon name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'month' && {backgroundColor: colors.accent}]}
              onPress={() => setViewMode('month')}>
              <Text style={[styles.viewButtonText, viewMode === 'month' && {color: colors.primary}]}>
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'week' && {backgroundColor: colors.accent}]}
              onPress={() => setViewMode('week')}>
              <Text style={[styles.viewButtonText, viewMode === 'week' && {color: colors.primary}]}>
                Week
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {viewMode === 'month' ? (
          <View style={styles.monthGrid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={[styles.dayHeader, {color: colors.textSecondary}]}>
                {day}
              </Text>
            ))}
            {renderMonthView()}
          </View>
        ) : (
          <View style={styles.weekView}>
            {daysInWeek.map((date, index) => {
              const status = getDayStatus(date);
              const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
              const dayName = date.toLocaleDateString('en-US', {weekday: 'short'});

              return (
                <View key={index} style={styles.weekDay}>
                  <Text style={[styles.weekDayName, {color: colors.textSecondary}]}>
                    {dayName}
                  </Text>
                  <View
                    style={[
                      styles.weekDayCircle,
                      {borderColor: getDayColor(status), backgroundColor: isToday ? colors.accent : 'transparent'},
                    ]}>
                    <Text style={[styles.weekDayNumber, {color: isToday ? colors.primary : colors.text}]}>
                      {date.getDate()}
                    </Text>
                  </View>
                  <View style={[styles.weekDayBar, {backgroundColor: getDayColor(status)}]} />
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.legend}>
          <Text style={[styles.legendTitle, {color: colors.text}]}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: colors.success}]} />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>100%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: colors.warning}]} />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>50-99%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: colors.accent}]} />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>1-49%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: colors.border}]} />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>0%</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={[styles.statsTitle, {color: colors.text}]}>Weekly Summary</Text>
          <View style={styles.statsGrid}>
            {daysInWeek.map((date, index) => {
              const status = getDayStatus(date);
              return (
                <View key={index} style={styles.statItem}>
                  <View
                    style={[
                      styles.statCircle,
                      {backgroundColor: getDayColor(status)},
                    ]}
                  />
                  <Text style={[styles.statValue, {color: colors.text}]}>
                    {status === 'full' ? '✓' : status === 'empty' ? '✗' : '•'}
                  </Text>
                </View>
              );
            })}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  todayButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  dayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  weekDay: {
    alignItems: 'center',
    flex: 1,
  },
  weekDayName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  weekDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  weekDayNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  weekDayBar: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  legend: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
  },
  stats: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CalendarScreen;
