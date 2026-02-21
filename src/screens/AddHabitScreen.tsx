import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useHabits} from '../context/HabitContext';
import {useTheme} from '../context/ThemeContext';

const habitIcons = [
  'fitness_center', 'school', 'work', 'self_improvement', 'people',
  'palette', 'music_note', 'restaurant', 'local_cafe', 'bedtime',
  'directions_run', 'local_drink', 'spa', 'sports_soccer', 'brush',
];

const habitColors = [
  '#FF6B4A', '#18A999', '#F7B32B', '#9C88FF', '#FF9FF3',
  '#54A0FF', '#00D2D3', '#FF9F43', '#EE5A24', '#0ABDE3',
  '#10AC84', '#C44569', '#40407A', '#706FD3', '#F8EFBA',
];

function AddHabitScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {addHabit, state} = useHabits();
  const {colors} = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState('1');
  const [unit, setUnit] = useState('times');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedIcon, setSelectedIcon] = useState('fitness_center');
  const [selectedColor, setSelectedColor] = useState('#FF6B4A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const targetNum = parseInt(target, 10);
    if (isNaN(targetNum) || targetNum <= 0) {
      Alert.alert('Error', 'Please enter a valid target');
      return;
    }

    setIsSubmitting(true);
    try {
      await addHabit({
        name: name.trim(),
        description: description.trim(),
        category,
        color: selectedColor,
        icon: selectedIcon,
        target: targetNum,
        unit,
        frequency,
        isActive: true,
      });

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to create habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Add New Habit</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Basic Information</Text>

          <View style={[styles.inputGroup, {borderColor: colors.border}]}>
            <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Habit Name *</Text>
            <TextInput
              style={[styles.textInput, {color: colors.text, borderColor: colors.border}]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Drink 8 glasses of water"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputGroup, {borderColor: colors.border}]}>
            <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Description</Text>
            <TextInput
              style={[styles.textArea, {color: colors.text, borderColor: colors.border}]}
              value={description}
              onChangeText={setDescription}
              placeholder="Optional description..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Category *</Text>
          <View style={styles.categoryGrid}>
            {state.categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: category === cat.id ? cat.color : colors.surface,
                    borderColor: category === cat.id ? cat.color : colors.border,
                  },
                ]}
                onPress={() => setCategory(cat.id)}>
                <Icon
                  name={cat.icon as any}
                  size={24}
                  color={category === cat.id ? colors.primary : cat.color}
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: category === cat.id ? colors.primary : colors.text,
                    },
                  ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Target & Frequency</Text>

          <View style={styles.targetRow}>
            <View style={[styles.inputGroup, {flex: 1, borderColor: colors.border}]}>
              <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Target</Text>
              <TextInput
                style={[styles.textInput, {color: colors.text, borderColor: colors.border}]}
                value={target}
                onChangeText={setTarget}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={[styles.inputGroup, {flex: 1, marginLeft: 12, borderColor: colors.border}]}>
              <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Unit</Text>
              <TextInput
                style={[styles.textInput, {color: colors.text, borderColor: colors.border}]}
                value={unit}
                onChangeText={setUnit}
                placeholder="times"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, {borderColor: colors.border}]}>
            <Text style={[styles.inputLabel, {color: colors.textSecondary}]}>Frequency</Text>
            <View style={styles.frequencyOptions}>
              {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    {
                      backgroundColor: frequency === freq ? colors.accent : colors.surface,
                      borderColor: frequency === freq ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => setFrequency(freq)}>
                  <Text
                    style={[
                      styles.frequencyText,
                      {
                        color: frequency === freq ? colors.primary : colors.text,
                      },
                    ]}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Appearance</Text>

          <Text style={[styles.inputLabel, {color: colors.textSecondary, marginBottom: 12}]}>Icon</Text>
          <View style={styles.iconGrid}>
            {habitIcons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  {
                    backgroundColor: selectedIcon === icon ? colors.accent : colors.surface,
                    borderColor: selectedIcon === icon ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setSelectedIcon(icon)}>
                <Icon
                  name={icon as any}
                  size={24}
                  color={selectedIcon === icon ? colors.primary : colors.text}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.inputLabel, {color: colors.textSecondary, marginTop: 16, marginBottom: 12}]}>Color</Text>
          <View style={styles.colorGrid}>
            {habitColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 3 : 1,
                    borderColor: selectedColor === color ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, {borderColor: colors.border}]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelButtonText, {color: colors.text}]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: colors.accent, opacity: isSubmitting ? 0.6 : 1},
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            <Text style={[styles.submitButtonText, {color: colors.primary}]}>
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
  },
  textArea: {
    fontSize: 16,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  targetRow: {
    flexDirection: 'row',
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddHabitScreen;
