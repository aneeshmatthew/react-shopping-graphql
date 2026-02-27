import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isCartOpen: false,
  },
  reducers: {
    addToCart(state, action) {
      const { id, variantId, name, price, currency, thumbnail, variant } = action.payload;
      const existing = state.items.find((item) => item.variantId === variantId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id, variantId, name, price, currency, thumbnail, variant, quantity: 1 });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.variantId !== action.payload);
    },
    updateQuantity(state, action) {
      const { variantId, quantity } = action.payload;
      const item = state.items.find((item) => item.variantId === variantId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.variantId !== variantId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectIsCartOpen = (state) => state.cart.isCartOpen;

export default cartSlice.reducer;
