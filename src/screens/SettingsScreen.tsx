import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {useHabits} from '../context/HabitContext';

type SettingItemProps = {
  title: string;
  subtitle?: string;
  icon: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
};

function SettingItem({title, subtitle, icon, rightElement, onPress}: SettingItemProps) {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingItem, {borderColor: colors.border}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, {backgroundColor: `${colors.accent}22`}]}>
        <Icon name={icon} size={20} color={colors.accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, {color: colors.textSecondary}]}>{subtitle}</Text>}
      </View>
      {rightElement || <Icon name="chevron-right" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
}

function SettingsScreen(): React.JSX.Element {
  const {colors} = useTheme();
  const {user, updateSettings, logout, upgradeToPremium} = useAuth();
  const {resetData} = useHabits();
  const [notifications, setNotifications] = useState(user?.settings.notifications ?? true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'Are you sure you want to reset all your data? This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            Alert.alert('Success', 'All data has been reset');
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const {exportData} = useHabits();
      const data = await exportData();
      Alert.alert('Data Exported', 'Your data has been copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Preferences</Text>
          
          <SettingItem
            title="Notifications"
            subtitle="Receive reminders and updates"
            icon="notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={async (value) => {
                  setNotifications(value);
                  await updateSettings({notifications: value});
                }}
                trackColor={{false: colors.border, true: colors.accent}}
                thumbColor={colors.primary}
              />
            }
          />
          
          <SettingItem
            title="Streak Reminders"
            subtitle="Get notified when streaks are at risk"
            icon="timer"
            rightElement={
              <Switch
                value={streakReminders}
                onValueChange={async (value) => {
                  setStreakReminders(value);
                  await updateSettings({notifications: {...user?.settings, streakReminders: value}});
                }}
                trackColor={{false: colors.border, true: colors.accent}}
                thumbColor={colors.primary}
              />
            }
          />
          
          <SettingItem
            title="Weekly Summary"
            subtitle="Receive weekly progress reports"
            icon="analytics"
            rightElement={
              <Switch
                value={weeklySummary}
                onValueChange={async (value) => {
                  setWeeklySummary(value);
                  await updateSettings({notifications: {...user?.settings, weeklySummary: value}});
                }}
                trackColor={{false: colors.border, true: colors.accent}}
                thumbColor={colors.primary}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Appearance</Text>
          
          <SettingItem
            title="Theme"
            subtitle={user?.settings.theme === 'system' ? 'System default' : user?.settings.theme}
            icon="palette"
            onPress={() => {
              const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
              const currentIndex = themes.indexOf(user?.settings.theme || 'system');
              const nextTheme = themes[(currentIndex + 1) % 3];
              updateSettings({theme: nextTheme});
            }}
          />
          
          <SettingItem
            title="Week Starts On"
            subtitle={user?.settings.weekStartsOn === 0 ? 'Sunday' : 'Monday'}
            icon="event"
            onPress={() => {
              const newStart = user?.settings.weekStartsOn === 0 ? 1 : 0;
              updateSettings({weekStartsOn: newStart});
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Account</Text>
          
          <SettingItem
            title="Premium Features"
            subtitle={user?.premium ? 'Active until ' + user.premiumExpiry?.toLocaleDateString() : 'Free'}
            icon="star"
            rightElement={
              user?.premium ? (
                <Icon name="check" size={20} color={colors.success} />
              ) : (
                <Icon name="chevron-right" size={20} color={colors.textSecondary} />
              )
            }
            onPress={() => upgradeToPremium()}
          />
          
          <SettingItem
            title="Export Data"
            subtitle="Backup your habits and progress"
            icon="cloud_download"
            onPress={handleExportData}
          />
          
          <SettingItem
            title="Reset All Data"
            subtitle="Clear all habits and progress"
            icon="delete_forever"
            onPress={handleResetData}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Support</Text>
          
          <SettingItem
            title="Help & Support"
            subtitle="Get help with the app"
            icon="help"
          />
          
          <SettingItem
            title="About"
            subtitle="Version 1.0.0"
            icon="info"
          />
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, {borderColor: colors.border}]}
          onPress={logout}
          activeOpacity={0.7}>
          <Text style={[styles.logoutText, {color: colors.error}]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: colors.textSecondary}]}>
            Habit Tracker App v1.0.0
          </Text>
          <Text style={[styles.footerText, {color: colors.textSecondary}]}>
            © 2026 Habit Tracker. All rights reserved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
  },
});

export default SettingsScreen;
