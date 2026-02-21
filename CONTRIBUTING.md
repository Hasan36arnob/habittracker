# Contributing to Habit Tracker

Thank you for your interest in contributing to Habit Tracker! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker to report bugs
- Include steps to reproduce the issue
- Include expected behavior and actual behavior
- Include screenshots if applicable
- Include your environment (device, OS, app version)

### Suggesting Features

- Use the GitHub issue tracker to suggest features
- Provide a clear description of the feature
- Explain why this feature would be useful
- Include any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v22.11.0 or higher)
- npm or yarn
- React Native CLI
- Android Studio or Xcode

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

### Running Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Coding Standards

- Follow the existing code style
- Use TypeScript for all new code
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation as needed

## Commit Messages

Use the following format for commit messages:

```
type: description

body (optional)

footer (optional)
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Code change that improves performance
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

Example:
```
feat: add habit streak tracking

- Track current and longest streaks for each habit
- Display streaks on habit cards
- Calculate streaks based on completion history
```

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the documentation with details of any new features
3. The PR will be merged once you have the sign-off of at least one maintainer

## Questions?

Feel free to open an issue or contact the maintainers if you have any questions.
