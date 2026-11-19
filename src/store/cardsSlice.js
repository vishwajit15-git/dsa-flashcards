import { createSlice } from '@reduxjs/toolkit';
import { ALL_TOPICS, BOX_INTERVALS, DAY_MS, getToday } from '../config.js';

const initialState = {
  cards: {},
  studyLog: [],
  deck: ALL_TOPICS,
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    rateCard: (state, action) => {
      const { id, knew } = action.payload;
      const current = state.cards[id];
      const box = knew ? Math.min((current?.box || 1) + 1, 3) : 1;
      const dueAt = Date.now() + BOX_INTERVALS[box] * DAY_MS;

      state.cards[id] = {
        id,
        box,
        dueAt,
        timesSeen: (current?.timesSeen || 0) + 1,
        timesKnown: (current?.timesKnown || 0) + (knew ? 1 : 0),
      };

      const today = getToday();
      const log = state.studyLog.find((entry) => entry.date === today);
      if (log) {
        log.studied++;
        if (knew) log.known++;
      } else {
        state.studyLog.push({ date: today, studied: 1, known: knew ? 1 : 0 });
      }
    },
    setDeck: (state, action) => {
      state.deck = action.payload;
    },
    clearProgress: (state) => {
      state.cards = {};
      state.studyLog = [];
      state.deck = ALL_TOPICS;
    },
    hydrate: (state, action) => {
      if (!action.payload) return;
      if (action.payload.cards) state.cards = action.payload.cards;
      if (Array.isArray(action.payload.studyLog)) {
        state.studyLog = action.payload.studyLog;
      }
      if (action.payload.deck) state.deck = action.payload.deck;
    },
  },
});

export const { rateCard, setDeck, clearProgress, hydrate } = cardsSlice.actions;
export default cardsSlice.reducer;
