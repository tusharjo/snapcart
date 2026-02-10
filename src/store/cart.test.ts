import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, Product } from "./cart";

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  description: "Test Description",
  price: 99.99,
  image: "test.jpg",
  quantity: 1,
  thumbnail: "test-thumb.jpg",
  stock: 10,
};

const mockProduct2: Product = {
  id: 2,
  title: "Test Product 2",
  description: "Test Description 2",
  price: 49.99,
  image: "test2.jpg",
  quantity: 1,
  thumbnail: "test2-thumb.jpg",
  stock: 5,
};

describe("Cart Store", () => {
  beforeEach(() => {
    // Reset the store before each test
    useCartStore.getState().resetState();
  });

  describe("updateCart", () => {
    it("should add a new product to the cart with quantity 1", () => {
      const { updateCart } = useCartStore.getState();

      updateCart(mockProduct);

      const updatedCart = useCartStore.getState().cart;
      expect(updatedCart).toHaveLength(1);
      expect(updatedCart[0]).toEqual({ ...mockProduct, quantity: 1 });
    });

    it("should increment quantity when adding existing product", () => {
      const { updateCart } = useCartStore.getState();

      // Add product first time
      updateCart(mockProduct);
      // Add same product again
      updateCart(mockProduct);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(2);
    });

    it("should handle multiple different products", () => {
      const { updateCart } = useCartStore.getState();

      updateCart(mockProduct);
      updateCart(mockProduct2);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(2);
      expect(cart[0].id).toBe(1);
      expect(cart[1].id).toBe(2);
    });

    it("should increment quantity multiple times", () => {
      const { updateCart } = useCartStore.getState();

      updateCart(mockProduct);
      updateCart(mockProduct);
      updateCart(mockProduct);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
    });
  });

  describe("removeItemFromCart", () => {
    it("should decrement quantity when removing item", () => {
      const { updateCart, removeItemFromCart } = useCartStore.getState();

      // Add product twice
      updateCart(mockProduct);
      updateCart(mockProduct);

      // Remove once
      removeItemFromCart(mockProduct.id);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(1);
    });

    it("should remove product completely when quantity reaches 1", () => {
      const { updateCart, removeItemFromCart } = useCartStore.getState();

      // Add product once
      updateCart(mockProduct);

      // Remove it
      removeItemFromCart(mockProduct.id);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(0);
    });

    it("should not affect other products when removing", () => {
      const { updateCart, removeItemFromCart } = useCartStore.getState();

      updateCart(mockProduct);
      updateCart(mockProduct);
      updateCart(mockProduct2);

      removeItemFromCart(mockProduct.id);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(2);
      expect(cart.find((p) => p.id === mockProduct.id)?.quantity).toBe(1);
      expect(cart.find((p) => p.id === mockProduct2.id)?.quantity).toBe(1);
    });

    it("should do nothing if product is not in cart", () => {
      const { removeItemFromCart } = useCartStore.getState();

      removeItemFromCart(999);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(0);
    });
  });

  describe("removeProduct", () => {
    it("should remove product completely regardless of quantity", () => {
      const { updateCart, removeProduct } = useCartStore.getState();

      // Add product multiple times
      updateCart(mockProduct);
      updateCart(mockProduct);
      updateCart(mockProduct);

      // Remove product completely
      removeProduct(mockProduct.id);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(0);
    });

    it("should only remove specified product", () => {
      const { updateCart, removeProduct } = useCartStore.getState();

      updateCart(mockProduct);
      updateCart(mockProduct2);

      removeProduct(mockProduct.id);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].id).toBe(mockProduct2.id);
    });

    it("should handle removing non-existent product", () => {
      const { updateCart, removeProduct } = useCartStore.getState();

      updateCart(mockProduct);

      removeProduct(999);

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(1);
    });
  });

  describe("resetState", () => {
    it("should clear all items from cart", () => {
      const { updateCart, resetState } = useCartStore.getState();

      updateCart(mockProduct);
      updateCart(mockProduct2);

      resetState();

      const cart = useCartStore.getState().cart;
      expect(cart).toHaveLength(0);
    });

    it("should reset to initial state", () => {
      const { updateCart, resetState } = useCartStore.getState();

      updateCart(mockProduct);
      resetState();

      const state = useCartStore.getState();
      expect(state.cart).toEqual([]);
    });
  });
});
