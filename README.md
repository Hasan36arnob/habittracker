# Habit Tracker App

A beautiful, feature-rich habit tracking application built with React Native. Track your daily habits, monitor your progress, and build lasting routines with this comprehensive tracker.

## Features

- **Track Multiple Habits**: Create and manage habits across different categories
- **Daily Progress**: Visual progress tracking with completion percentages
- **Streak Tracking**: Monitor your consistency with current and longest streaks
- **Analytics & Statistics**: Detailed insights into your habit performance
- **Calendar View**: Visual calendar showing your activity over time
- **Customizable**: Personalize habits with icons, colors, and categories
- **Dark/Light Mode**: Switch between themes based on your preference
- **Data Persistence**: All data is saved locally using AsyncStorage
- **Export/Import**: Backup and restore your habit data

## Categories

- Health (fitness, nutrition, sleep)
- Learning (education, skill development)
- Productivity (work, efficiency)
- Mindfulness (meditation, mental health)
- Social (relationships, connections)
- Creativity (art, creative pursuits)

## Getting Started

### Prerequisites

- Node.js (v22.11.0 or higher)
- npm or yarn
- React Native CLI
- Android Studio or Xcode (for mobile development)

### Installation

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
HabitTrackerApp/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── HabitContext.tsx
│   │   └── ThemeContext.tsx
│   ├── screens/         # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── HabitsScreen.tsx
│   │   ├── AddHabitScreen.tsx
│   │   ├── EditHabitScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── android/             # Android project files
├── ios/                 # iOS project files
└── app.json             # App configuration
```

## Technologies Used

- React Native 0.84.0
- TypeScript
- React Navigation (Stack & Bottom Tabs)
- AsyncStorage for local data persistence
- React Native Vector Icons
- React Native Safe Area Context
- React Native Reanimated
- React Native Screens
- React Native Gesture Handler

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building for Production

#### Android

```bash
cd android
./gradlew assembleRelease
```

#### iOS

Open `ios/HabitTrackerApp.xcworkspace` in Xcode and build for release.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with React Native
- Icons from Material Icons
- Color palette inspired by modern design principles

## Support

For support, email [support@habittracker.app](mailto:support@habittracker.app) or open an issue on GitHub.

---

Made with ❤️ for habit builders everywhere
