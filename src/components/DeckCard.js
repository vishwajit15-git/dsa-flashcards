import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING, MIN_TOUCH } from '../config.js';

export default function DeckCard({
  title,
  total,
  mastered,
  isActive = false,
  onPress,
}) {
  const ratio = total > 0 ? mastered / total : 0;
  const pct = Math.round(ratio * 100);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, isActive && styles.activeCard]}
    >
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {isActive && <Text style={styles.activeText}>Active</Text>}
      </View>

      <View style={styles.stats}>
        <Text style={styles.meta}>
          {mastered} of {total} mastered
        </Text>
        <Text style={styles.meta}>{pct}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
    minHeight: MIN_TOUCH,
  },
  activeCard: {
    borderColor: COLORS.accent,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.accent,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  meta: {
    fontSize: SIZES.small,
    color: COLORS.muted,
  },
  track: {
    height: 4,
    width: '100%',
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
});
