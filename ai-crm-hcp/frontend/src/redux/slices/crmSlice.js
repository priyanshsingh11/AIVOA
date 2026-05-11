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

export const { updateField, addMessage, setLoading, setError, resetForm } = crmSlice.actions;
export default crmSlice.reducer;
