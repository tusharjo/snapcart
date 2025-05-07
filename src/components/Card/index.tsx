import { Button } from "@/components/ui/button";
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product, useCartStore } from "@/store/cart";
import { CircleX, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

export const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {!isLoaded && !hasError && (
        <Skeleton className="h-[215px] w-[215px] rounded-xl" />
      )}
      {hasError && <div>Image not available</div>}

      <img
        src={src}
        alt={alt}
        style={{ display: isLoaded ? "block" : "none", width: "100%" }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export const Card = ({ product }: { product: Product }) => {
  const cart = useCartStore((state) => state.cart);
  const updateCart = useCartStore((state) => state.updateCart);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const removeProduct = useCartStore((state) => state.removeProduct);

  const productInCart = cart?.find(({ id }) => id === product.id);

  const getAddToCartText = () => {
    if (cart.some(({ id }) => id === product.id)) {
      return (
        <>
          <ShoppingCart /> {productInCart?.quantity} in cart{" "}
        </>
      );
    }

    return (
      <>
        <ShoppingCart /> Add to Cart
      </>
    );
  };

  return (
    <div key={product.title}>
      <CardComponent>
        <CardHeader>
          <ProductImage src={product.thumbnail} alt={product.title} />

          <CardTitle className="truncate">{product.title}</CardTitle>
          <CardDescription className="truncate">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>${product.price}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="cursor-pointer"
            disabled={product?.stock === productInCart?.quantity}
            onClick={() => {
              updateCart(product);
            }}
          >
            {getAddToCartText()}
          </Button>

          {productInCart?.quantity ? (
            <Button
              variant="outline"
              className="cursor-pointer"
              type="button"
              onClick={() => {
                removeItemFromCart(product.id);
              }}
            >
              <Minus />
            </Button>
          ) : null}

          {productInCart?.quantity ? (
            <Button
              variant="outline"
              className="cursor-pointer"
              type="button"
              onClick={() => removeProduct(product.id)}
            >
              <CircleX />
            </Button>
          ) : null}
        </CardFooter>
      </CardComponent>
    </div>
  );
};
