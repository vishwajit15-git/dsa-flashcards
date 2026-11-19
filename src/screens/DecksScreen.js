import { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import DeckCard from '../components/DeckCard.js';
import cardsData from '../data/cards.json';
import { setDeck } from '../store/cardsSlice.js';
import { COLORS, SIZES, SPACING, ALL_TOPICS } from '../config.js';

export default function DecksScreen({ navigation }) {
  const dispatch = useDispatch();
  const progress = useSelector((state) => state.cards.cards);
  const activeDeck = useSelector((state) => state.cards.deck);

  const decks = useMemo(() => {
    if (!cardsData?.length) return [];

    const allMastered = cardsData.filter(
      (c) => progress[c.id]?.box === 3
    ).length;
    const all = {
      title: ALL_TOPICS,
      total: cardsData.length,
      mastered: allMastered,
    };

    const topics = Array.from(new Set(cardsData.map((c) => c.topic)));
    const list = topics.map((topic) => {
      const cards = cardsData.filter((c) => c.topic === topic);
      const mastered = cards.filter((c) => progress[c.id]?.box === 3).length;
      return { title: topic, total: cards.length, mastered };
    });

    return [all, ...list];
  }, [progress]);

  const selectDeck = (title) => {
    dispatch(setDeck(title));
    navigation.navigate('Study');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Decks</Text>
      </View>

      <FlatList
        data={decks}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No decks.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DeckCard
            title={item.title}
            total={item.total}
            mastered={item.mastered}
            isActive={item.title === activeDeck}
            onPress={() => selectDeck(item.title)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  title: {
    fontSize: SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
  },
  list: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  empty: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.muted,
  },
});
