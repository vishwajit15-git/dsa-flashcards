import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, SIZES, SPACING } from '../config.js';

export default function FlipCard({ card, isFlipped, onFlip }) {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withTiming(isFlipped ? 180 : 0, { duration: 200 });
  }, [isFlipped]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotate.value}deg` }],
    opacity: rotate.value <= 90 ? 1 : 0,
    backfaceVisibility: 'hidden',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotate.value - 180}deg` }],
    opacity: rotate.value > 90 ? 1 : 0,
    backfaceVisibility: 'hidden',
  }));

  if (!card) return null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onFlip} style={styles.card}>
      <Animated.View style={[styles.face, frontStyle]}>
        <View style={styles.header}>
          <Text style={styles.topic}>{card.topic}</Text>
          <Text style={styles.meta}>{card.difficulty?.toUpperCase()}</Text>
        </View>

        <Text style={styles.question}>{card.question}</Text>
        <Text style={styles.hint}>Tap to flip</Text>
      </Animated.View>

      <Animated.View style={[styles.face, styles.faceBack, backStyle]}>
        <View style={styles.header}>
          <Text style={styles.topic}>{card.topic}</Text>
          <Text style={styles.meta}>ANSWER</Text>
        </View>

        <Text style={styles.answer}>{card.answer}</Text>
        <Text style={styles.hint}>Tap to flip</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 360,
    marginVertical: SPACING.sm,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  faceBack: {
    borderColor: COLORS.accent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topic: {
    color: COLORS.accent,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  meta: {
    color: COLORS.muted,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  question: {
    color: COLORS.text,
    fontSize: SIZES.heading,
    fontWeight: '600',
    lineHeight: 30,
  },
  answer: {
    color: COLORS.text,
    fontSize: SIZES.body,
    lineHeight: 24,
  },
  hint: {
    color: COLORS.muted,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
});
