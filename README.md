# DSA Flashcards

An offline-first mobile flashcard application built with React Native and Expo, designed to help software engineers master core Data Structures & Algorithms (DSA) concepts through spaced repetition.

---

## Features

- **Topic Decks & Overview**: Browse decks by topic (Arrays, Linked Lists, Trees, Graphs, Dynamic Programming) or choose the "All topics" deck. Each deck displays total card counts, mastered count (Box 3), and visual progress bars.
- **3D Card Flip**: Smooth Y-axis card flip animation using `react-native-reanimated` with perspective transforms—tap the card to view the answer and rating controls.
- **Leitner Spaced Repetition**: 3-box review algorithm that schedules cards according to recall success, prioritizing difficult or new cards first.
- **Learning Analytics**:
  - **Overall Accuracy**: Ratio of times known vs. times seen (`timesKnown / timesSeen`).
  - **Topic Accuracy Breakdown**: Horizontal progress bars showing recall performance per DSA topic without external charting dependencies.
  - **Daily Activity Tracker**: Real-time counter of cards reviewed today.
  - **Consecutive Daily Streak**: Tracks consecutive days with at least 1 card studied based on local calendar dates.
- **Offline Persistence & Resilience**: Saves progress to `AsyncStorage` on every store update and safely handles empty or malformed storage data without crashing.
- **Accessible UI**: Designed with WCAG AA compliant high-contrast dark text on clean light surfaces, and touch targets of at least 44px.
- **Progress Reset**: Reset progress with a native confirmation dialog.

---

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 58) / [React Native](https://reactnative.dev/) (0.88+)
- **Language**: JavaScript (ES6+, Functional Components & Hooks)
- **Navigation**: [React Navigation](https://reactnavigation.org/) Bottom Tabs (`@react-navigation/bottom-tabs`, `@react-navigation/native`)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (v4)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (`@react-native-async-storage/async-storage`)
- **Safe Area**: `react-native-safe-area-context`, `react-native-screens`

---

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device, or an active Android Emulator / iOS Simulator.

### Installation & Launch

1. Clone or navigate to the project directory:

   ```bash
   cd d:\BackEnd\Major-Projects\FlashCard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npx expo start
   ```

4. Open the app:
   - **Physical Device**: Scan the QR code displayed in the terminal using the Expo Go app (Android) or the default Camera app (iOS).
   - **Android Emulator**: Press `a` in the terminal.
   - **iOS Simulator**: Press `i` in the terminal (macOS only).
   - **Web Browser**: Press `w` in the terminal.

---

## Project Structure

```
FlashCard/
├── App.js                      # Root component: Redux Provider, hydration loader
├── app.json                    # Expo configuration
├── babel.config.js             # Babel preset and Reanimated plugin
├── package.json                # Project dependencies and scripts
└── src/
    ├── config.js               # Central constants and theme colors
    ├── components/
    │   ├── AppNavigator.js     # Bottom tab navigator (Decks, Study, Progress)
    │   ├── DeckCard.js         # Topic card with mastery percentage & progress bar
    │   └── FlipCard.js         # 3D animated flip card with Reanimated rotateY
    ├── data/
    │   └── cards.json          # Seed flashcards (10 initial questions across 5 topics)
    ├── screens/
    │   ├── DecksScreen.js      # Deck selection and topic progress
    │   ├── StudyScreen.js      # Study session queue, flip cards, Leitner rating
    │   └── ProgressScreen.js   # Analytics dashboard, topic bars, reset action
    └── store/
        ├── cardsSlice.js       # Redux slice: rateCard, setDeck, clearProgress, hydrate
        └── store.js            # Redux store with AsyncStorage persistence
```

---

## How the Leitner System Works

The app implements a 3-box Leitner spaced repetition schedule:

```
[ New / Missed ] ──> [ Box 1 ] ──(Knew it)──> [ Box 2 ] ──(Knew it)──> [ Box 3 ] (Mastered)
                          │                       │                       │
                          └──────(Review again)───┴──────(Review again)───┘
```

1. **Boxes & Intervals**:
   - **Box 1 (New / Learning)**: 0-day interval (due immediately).
   - **Box 2 (Reviewing)**: 1-day interval (due 24 hours after review).
   - **Box 3 (Mastered)**: 3-day interval (due 72 hours after review).

2. **Progression Rules**:
   - **"Knew it"**: The card moves up one box: `box = min(currentBox + 1, 3)`.
   - **"Review again"**: The card drops back to `box = 1` immediately, requiring re-learning.

3. **Queue Sorting**:
   - When a study session starts, cards due for review (`dueAt <= now`) are queued with **Box 1 cards first**, ensuring high-difficulty and unlearned material is addressed before reviewing familiar cards.

4. **Session Completion**:
   - When all due cards in the selected deck have been answered, the study screen displays a completion screen with the exact time until the next scheduled review.

---

## Future Improvements

- **Custom Flashcard Creation**: An in-app editor to create, edit, and delete custom decks and cards.
- **Review Ahead**: An optional toggle allowing users to review cards before their scheduled Leitner due date.
- **Immediate Re-queueing**: Re-insert missed cards at the end of the active study session so every card is answered correctly before concluding.
- **Syntax Highlighting**: Code block rendering for algorithmic snippets and time/space complexity tags.
- **Appearance Settings**: Support for user-toggled and system-matched Dark Mode.
- **Daily Reminders**: Local scheduled push notifications to help maintain study streaks.
