import { createStore } from "vuex";
import { v1Product } from "@/typings/v1-jsonapi";

export type Cart = { [id: string]: v1Product };

export type MainState = {
  cart: Cart;
};

const cart: Cart = {};

const state = {
  cart,
};

export default createStore({
  state,
  getters: {
    cart(state: MainState): Cart {
      return state.cart;
    },
  },
  mutations: {
    addToCart(state: MainState, product: v1Product) {
      if (product?.id) {
        state.cart[product.id] = product;
      }
    },
    removeFromCart(state: MainState, product: v1Product) {
      if (product?.id) {
        delete state.cart[product.id];
      }
    },
    toggleInCart(state: MainState, product: v1Product) {
      if (product?.id) {
        if (state.cart[product.id]) {
          delete state.cart[product.id];
        } else {
          state.cart[product.id] = product;
        }
      }
    },
  },
  actions: {},
  modules: {},
});
