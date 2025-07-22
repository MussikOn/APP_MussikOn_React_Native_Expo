import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormsState {
  [formId: string]: {
    [field: string]: any;
  };
}

const initialState: FormsState = {};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    updateFormField(
      state,
      action: PayloadAction<{ formId: string; field: string; value: any }>
    ) {
      const { formId, field, value } = action.payload;
      if (!state[formId]) {
        state[formId] = {};
      }
      state[formId][field] = value;
    },
    clearForm(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const { updateFormField, clearForm } = formsSlice.actions;
export default formsSlice.reducer; 