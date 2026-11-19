import { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import FlipCard from '../components/FlipCard.js';
import cardsData from '../data/cards.json';
import { rateCard } from '../store/cardsSlice.js';
import { COLORS, SIZES, SPACING, ALL_TOPICS, MIN_TOUCH } from '../config.js';

function formatDue(cards, progress) {
  const now = Date.now();
  const times = cards
    .map((c) => progress[c.id]?.dueAt)
    .filter((t) => typeof t === 'number' && t > now);

  if (!times.length) return 'No cards scheduled.';

  const hours = Math.ceil((Math.min(...times) - now) / (1000 * 60 * 60));
  if (hours < 24) return `Next review in ${hours}h.`;
  const days = Math.ceil(hours / 24);
  return `Next review in ${days}d.`;
}

export default function StudyScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const deck = useSelector((state) => state.cards.deck);
  const progress = useSelector((state) => state.cards.cards);

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(null);

  const deckCards = useMemo(() => {
    if (!cardsData?.length) return [];
    if (deck === ALL_TOPICS) return cardsData;
    return cardsData.filter((c) => c.topic === deck);
  }, [deck]);

  useEffect(() => {
    if (isFocused && (currentDeck !== deck || queue.length === 0)) {
      const now = Date.now();
      const due = deckCards
        .filter((c) => (progress[c.id]?.dueAt ?? 0) <= now)
        .sort(
          (a, b) => (progress[a.id]?.box ?? 1) - (progress[b.id]?.box ?? 1)
        );

      setQueue(due);
      setIndex(0);
      setFlipped(false);
      setCurrentDeck(deck);
    }
  }, [isFocused, deck, currentDeck, deckCards, progress, queue.length]);

  const current = queue[index];
  const done = !current || index >= queue.length;
  const empty = deckCards.length === 0;

  const rate = (knew) => {
    if (!current) return;
    dispatch(rateCard({ id: current.id, knew }));
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const dueText = useMemo(
    () => formatDue(deckCards, progress),
    [deckCards, progress]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.deckTitle}>{deck}</Text>
        {!done && !empty && (
          <Text style={styles.meta}>
            {index + 1} of {queue.length}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {empty ? (
          <View style={styles.center}>
            <Text style={styles.doneTitle}>No cards in this deck.</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Decks')}
            >
              <Text style={styles.actionBtnText}>Back to decks</Text>
            </TouchableOpacity>
          </View>
        ) : done ? (
          <View style={styles.center}>
            <Text style={styles.doneTitle}>Done for now.</Text>
            <Text style={styles.dueText}>{dueText}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Decks')}
            >
              <Text style={styles.actionBtnText}>Back to decks</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.study}>
            <FlipCard
              card={current}
              isFlipped={flipped}
              onFlip={() => setFlipped((prev) => !prev)}
            />

            <View style={styles.actions}>
              {flipped ? (
                <View style={styles.row}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.rateBtn, styles.againBtn]}
                    onPress={() => rate(false)}
                  >
                    <Text style={styles.againText}>Review again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.rateBtn, styles.knewBtn]}
                    onPress={() => rate(true)}
                  >
                    <Text style={styles.knewText}>Knew it</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.prompt}>Tap card to flip</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  deckTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  meta: {
    fontSize: SIZES.small,
    color: COLORS.muted,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  study: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
  },
  actions: {
    minHeight: 48,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  rateBtn: {
    flex: 1,
    minHeight: MIN_TOUCH,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  againBtn: {
    borderColor: COLORS.error,
    borderWidth: 1,
    backgroundColor: COLORS.card,
  },
  againText: {
    color: COLORS.error,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  knewBtn: {
    backgroundColor: COLORS.accent,
  },
  knewText: {
    color: COLORS.card,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  prompt: {
    color: COLORS.muted,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  doneTitle: {
    fontSize: SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  dueText: {
    fontSize: SIZES.body,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  actionBtn: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    minHeight: MIN_TOUCH,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
});
