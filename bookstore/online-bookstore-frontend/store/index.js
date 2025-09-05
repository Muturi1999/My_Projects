// store/index.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Initial cart state
const initialCartState = {
  items: [],
  total: 0,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total += action.payload.price;
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.total -= state.items[index].price * state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Create Redux store
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  }
});

export default store;

// Optional Redux wrapper (if needed in _app.jsx)
export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
