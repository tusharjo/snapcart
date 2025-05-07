import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Product, useCartStore } from "@/store/cart";
import { House, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6 mt-10">
        <h1 className="text-2xl font-bold">Cart</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {cart.map((product: Product) => (
          <Card product={product} key={product.id} />
        ))}
      </div>

      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
          <h2 className="text-xl mb-5">Your cart is empty</h2>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <House />
            Go Home
          </Button>
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex items-center justify-between w-full mt-10 border-t pt-4">
          <h2 className="text-xl font-bold">
            Total: $
            {cart
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </h2>
          <Button
            className="cursor-pointer"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingBag /> Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
