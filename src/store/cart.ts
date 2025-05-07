import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const ACTION_TYPES = {
  UPDATE_CART: "updateCart",
  REMOVE_ITEM_FROM_CART: "removeItemFromCart",
  REMOVE_PRODUCT: "removeProduct",
  RESET_CART: "resetCart",
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  thumbnail: string;
  stock: number;
};

const initialState = {
  cart: [] as Product[],
};

interface CartStore {
  cart: Product[];
  updateCart: (payload: Product) => void;
  removeProduct: (id: number) => void;
  removeItemFromCart: (id: number) => void;
  resetState: () => void;
}

const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => {
      const actions = {
        updateCart: (payload: Product) =>
          set(
            produce((draft) => {
              const cart = get().cart;
              const existingItem = cart.find((item) => item.id === payload.id);
              if (!existingItem) {
                draft.cart = [...cart, { ...payload, quantity: 1 }];
              } else {
                draft.cart = cart.map((item) =>
                  item.id === payload.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
              }
            }),
            false,
            {
              type: ACTION_TYPES.UPDATE_CART,
              payload,
            }
          ),

        removeItemFromCart: (cartIdToRemove: number) =>
          set(
            produce((draft) => {
              const cart = get().cart;
              const isItemPresent = cart.find(
                (item) => item.id === cartIdToRemove
              );
              if (isItemPresent) {
                if (isItemPresent.quantity === 1) {
                  draft.cart = cart.filter(
                    (item) => item.id !== cartIdToRemove
                  );
                } else {
                  draft.cart = cart.map((item) =>
                    item.id === cartIdToRemove
                      ? { ...item, quantity: item.quantity - 1 }
                      : item
                  );
                }
              }
            }),
            false,
            {
              type: ACTION_TYPES.REMOVE_ITEM_FROM_CART,
              payload: cartIdToRemove,
            }
          ),

        removeProduct: (cartIdToRemove: number) =>
          set(
            produce((draft) => {
              const cart = get().cart;

              draft.cart = cart.filter((item) => item.id !== cartIdToRemove);
            }),
            false,
            {
              type: ACTION_TYPES.REMOVE_PRODUCT,
            }
          ),

        resetState: () =>
          set(() => initialState, false, {
            type: ACTION_TYPES.RESET_CART,
          }),
      };

      return {
        ...initialState,
        ...actions,
      };
    },
    {
      anonymousActionType: "cart",
    }
  )
);

export { useCartStore };
