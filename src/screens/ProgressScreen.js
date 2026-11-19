import { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import cardsData from '../data/cards.json';
import { clearProgress } from '../store/cardsSlice.js';
import { COLORS, SIZES, SPACING, MIN_TOUCH, getToday } from '../config.js';

function getStreak(studyLog) {
  if (!studyLog?.length) return 0;
  const days = new Set(
    studyLog.filter((s) => s.studied > 0).map((s) => s.date)
  );
  let streak = 0;
  const d = new Date();

  if (!days.has(getToday())) {
    d.setDate(d.getDate() - 1);
  }

  while (true) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${d.getFullYear()}-${m}-${day}`;
    if (!days.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

export default function ProgressScreen() {
  const dispatch = useDispatch();
  const progress = useSelector((state) => state.cards.cards);
  const studyLog = useSelector((state) => state.cards.studyLog);

  const { totalSeen, totalKnown, accuracy } = useMemo(() => {
    const list = Object.values(progress || {});
    const seen = list.reduce((sum, c) => sum + (c.timesSeen || 0), 0);
    const known = list.reduce((sum, c) => sum + (c.timesKnown || 0), 0);
    const acc = seen > 0 ? Math.round((known / seen) * 100) : 0;
    return { totalSeen: seen, totalKnown: known, accuracy: acc };
  }, [progress]);

  const topicStats = useMemo(() => {
    if (!cardsData?.length) return [];
    const topics = Array.from(new Set(cardsData.map((c) => c.topic)));
    return topics.map((topic) => {
      const cards = cardsData.filter((c) => c.topic === topic);
      const seen = cards.reduce(
        (sum, c) => sum + (progress[c.id]?.timesSeen || 0),
        0
      );
      const known = cards.reduce(
        (sum, c) => sum + (progress[c.id]?.timesKnown || 0),
        0
      );
      const acc = seen > 0 ? Math.round((known / seen) * 100) : 0;
      return { topic, seen, known, accuracy: acc };
    });
  }, [progress]);

  const todayCount = useMemo(() => {
    const today = getToday();
    const entry = studyLog?.find((s) => s.date === today);
    return entry?.studied || 0;
  }, [studyLog]);

  const streak = useMemo(() => getStreak(studyLog), [studyLog]);
  const hasData = totalSeen > 0 || studyLog?.length > 0;

  const confirmReset = () => {
    Alert.alert('Reset progress', 'Reset all progress?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => dispatch(clearProgress()),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>Accuracy</Text>
            <Text style={styles.tileValue}>{accuracy}%</Text>
            <Text style={styles.tileMeta}>
              {totalKnown}/{totalSeen}
            </Text>
          </View>
          <View style={styles.gap} />
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>Today</Text>
            <Text style={styles.tileValue}>{todayCount}</Text>
            <Text style={styles.tileMeta}>reviewed</Text>
          </View>
          <View style={styles.gap} />
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>Streak</Text>
            <Text style={styles.tileValue}>{streak}d</Text>
            <Text style={styles.tileMeta}>consecutive</Text>
          </View>
        </View>

        {!hasData && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No cards studied yet.</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topics</Text>
          {topicStats.map((item) => {
            const pct = Math.round(item.accuracy);
            return (
              <View key={item.topic} style={styles.topicRow}>
                <View style={styles.topicHeader}>
                  <Text style={styles.topicName}>{item.topic}</Text>
                  <Text style={styles.topicMeta}>
                    {item.known}/{item.seen} ({pct}%)
                  </Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${pct}%` }]} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.resetWrap}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!hasData}
            style={[styles.resetBtn, !hasData && styles.resetBtnDisabled]}
            onPress={confirmReset}
          >
            <Text
              style={[styles.resetText, !hasData && styles.resetTextDisabled]}
            >
              Reset progress
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
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  gap: {
    width: SPACING.xs,
  },
  tile: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: SPACING.xs,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  tileLabel: {
    fontSize: SIZES.small,
    color: COLORS.muted,
  },
  tileValue: {
    fontSize: SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 2,
  },
  tileMeta: {
    fontSize: SIZES.small,
    color: COLORS.muted,
  },
  empty: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.muted,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  topicRow: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  topicName: {
    fontSize: SIZES.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  topicMeta: {
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
  resetWrap: {
    marginTop: SPACING.xs,
    alignItems: 'center',
  },
  resetBtn: {
    borderColor: COLORS.error,
    borderWidth: 1,
    borderRadius: 6,
    minHeight: MIN_TOUCH,
    paddingVertical: SPACING.xs,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  resetBtnDisabled: {
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  resetText: {
    color: COLORS.error,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  resetTextDisabled: {
    color: COLORS.muted,
  },
});
