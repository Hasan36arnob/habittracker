import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {formatDate} from '../utils';

function ProfileScreen(): React.JSX.Element {
  const {user} = useAuth();
  const {colors} = useTheme();

  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
        <View style={styles.container}>
          <Icon name="person" size={64} color={colors.textSecondary} />
          <Text style={[styles.title, {color: colors.text}]}>Please Log In</Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            Sign in to access your profile and settings
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, {borderColor: colors.accent}]}>
            <Icon name="person" size={64} color={colors.accent} />
            {user.premium && (
              <View style={[styles.premiumBadge, {backgroundColor: colors.accent}]}>
                <Icon name="star" size={16} color={colors.primary} />
              </View>
            )}
          </View>
          <Text style={[styles.name, {color: colors.text}]}>{user.name}</Text>
          <Text style={[styles.email, {color: colors.textSecondary}]}>{user.email}</Text>
          <Text style={[styles.memberSince, {color: colors.textSecondary}]}>
            Member since {formatDate(user.createdAt)}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="check-circle" size={24} color={colors.success} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {user.settings.notifications ? 'On' : 'Off'}
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Notifications</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="theme-light" size={24} color={colors.accent} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {user.settings.theme === 'system' ? 'Auto' : user.settings.theme}
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Theme</Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Icon name="calendar-today" size={24} color={colors.warning} />
            <Text style={[styles.statValue, {color: colors.text}]}>
              {user.settings.weekStartsOn === 0 ? 'Sun' : 'Mon'}
            </Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Week Start</Text>
          </View>
        </View>

        <View style={styles.premiumSection}>
          <View style={[styles.premiumCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={styles.premiumContent}>
              <Icon name="star" size={32} color={colors.accent} />
              <View style={styles.premiumText}>
                <Text style={[styles.premiumTitle, {color: colors.text}]}>
                  {user.premium ? 'Premium Active' : 'Go Premium'}
                </Text>
                <Text style={[styles.premiumSubtitle, {color: colors.textSecondary}]}>
                  {user.premium
                    ? 'Unlock all features with premium'
                    : 'Get advanced analytics, unlimited habits, and more'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.premiumButton, {backgroundColor: colors.accent}]}
              onPress={() => {}}>
              <Text style={[styles.premiumButtonText, {color: colors.primary}]}>
                {user.premium ? 'Manage' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, {borderColor: colors.border}]}
            onPress={() => {}}>
            <Icon name="settings" size={20} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, {borderColor: colors.border}]}
            onPress={() => {}}>
            <Icon name="lock" size={20} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Privacy & Security</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, {borderColor: colors.border}]}
            onPress={() => {}}>
            <Icon name="help" size={20} color={colors.text} />
            <Text style={[styles.actionText, {color: colors.text}]}>Help & Support</Text>
          </TouchableOpacity>
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
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
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
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  premiumSection: {
    padding: 16,
  },
  premiumCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  premiumText: {
    flex: 1,
    gap: 4,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  premiumSubtitle: {
    fontSize: 14,
  },
  premiumButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    padding: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
