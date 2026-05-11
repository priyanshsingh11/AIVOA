import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentInteraction: {
    hcp_name: '',
    interaction_type: 'Meeting',
    date: '',
    time: '',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up: '',
    summary: '',
  },
  suggestedFollowUps: [
    "+ Schedule follow-up meeting in 2 weeks",
    "+ Send OncoBoost Phase III PDF",
    "+ Add Dr. Sharma to advisory board invite list"
  ],
  messages: [
    { role: 'assistant', content: "Hello! I'm your AI HCP Assistant. How can I help you today?" }
  ],
  loading: false,
  error: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.currentInteraction[field] = value;
    },
    batchUpdateFields: (state, action) => {
      state.currentInteraction = { ...state.currentInteraction, ...action.payload };
    },
    setSuggestions: (state, action) => {
      state.suggestedFollowUps = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetForm: (state) => {
      state.currentInteraction = initialState.currentInteraction;
    }
  },
});

export const { updateField, batchUpdateFields, setSuggestions, addMessage, setLoading, setError, resetForm } = crmSlice.actions;
export default crmSlice.reducer;
