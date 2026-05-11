import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interactions: [],
  loading: false,
  error: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    setInteractions: (state, action) => {
      state.interactions = action.payload;
    },
    addInteraction: (state, action) => {
      state.interactions.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setInteractions, addInteraction, setLoading, setError } = crmSlice.actions;
export default crmSlice.reducer;
