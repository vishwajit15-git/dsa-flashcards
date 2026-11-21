import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DecksScreen from '../screens/DecksScreen.js';
import StudyScreen from '../screens/StudyScreen.js';
import ProgressScreen from '../screens/ProgressScreen.js';
import { COLORS, SIZES } from '../config.js';

const Tab = createBottomTabNavigator();

function TabIcon({ name, color }) {
  if (name === 'Decks') {
    return (
      <View style={styles.iconBox}>
        <View style={[styles.deckBack, { borderColor: color }]} />
        <View
          style={[
            styles.deckFront,
            { borderColor: color, backgroundColor: COLORS.bg },
          ]}
        />
      </View>
    );
  }

  if (name === 'Study') {
    return (
      <View style={styles.iconBox}>
        <View style={[styles.cardShape, { borderColor: color }]}>
          <View style={[styles.cardLine, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.iconBox, styles.chartRow]}>
      <View style={[styles.bar, { height: 6, backgroundColor: color }]} />
      <View style={[styles.bar, { height: 11, backgroundColor: color }]} />
      <View style={[styles.bar, { height: 16, backgroundColor: color }]} />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabIcon name={route.name} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: COLORS.bg,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 56,
            paddingBottom: 6,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: SIZES.small,
            fontWeight: '600',
          },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.muted,
        })}
      >
        <Tab.Screen name="Decks" component={DecksScreen} />
        <Tab.Screen name="Study" component={StudyScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckBack: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 15,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
    opacity: 0.4,
  },
  deckFront: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 15,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
  },
  cardShape: {
    width: 18,
    height: 13,
    borderRadius: 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLine: {
    width: 8,
    height: 1.5,
    borderRadius: 1,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2.5,
  },
  bar: {
    width: 3,
    borderRadius: 1,
  },
});
