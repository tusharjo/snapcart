import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ProductImage, Card } from "./index";
import { useCartStore, Product } from "@/store/cart";

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  description: "Test Description",
  price: 99.99,
  image: "test.jpg",
  quantity: 1,
  thumbnail: "https://via.placeholder.com/150",
  stock: 10,
};

describe("ProductImage Component", () => {
  it("should show skeleton while image is loading", () => {
    render(<ProductImage src="test.jpg" alt="Test" />);

    // Skeleton should be visible initially
    const skeleton = document.querySelector(".h-\\[215px\\]");
    expect(skeleton).toBeInTheDocument();
  });

  it("should display image after successful load", async () => {
    render(
      <ProductImage src="https://via.placeholder.com/150" alt="Test" />
    );

    const img = screen.getByAltText("Test") as HTMLImageElement;

    // Simulate image load by calling the onLoad handler
    const loadEvent = new Event("load");
    Object.defineProperty(loadEvent, "target", { value: img, enumerable: true });
    img.dispatchEvent(loadEvent);

    await waitFor(() => {
      expect(img.style.display).toBe("block");
    });
  });

  it("should show error message on image load failure", async () => {
    render(<ProductImage src="invalid.jpg" alt="Test" />);

    const img = screen.getByAltText("Test") as HTMLImageElement;

    // Simulate image error by calling the onError handler
    const errorEvent = new Event("error");
    Object.defineProperty(errorEvent, "target", { value: img, enumerable: true });
    img.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(screen.getByText("Image not available")).toBeInTheDocument();
    });
  });
});

describe("Card Component", () => {
  beforeEach(() => {
    // Reset the store before each test
    useCartStore.getState().resetState();
  });

  it("should render product information correctly", () => {
    render(<Card product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("should show 'Add to Cart' button when product not in cart", () => {
    render(<Card product={mockProduct} />);

    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("should add product to cart when clicking 'Add to Cart'", async () => {
    const user = userEvent.setup();
    render(<Card product={mockProduct} />);

    const addButton = screen.getByText("Add to Cart").closest("button");
    await user.click(addButton!);

    const cart = useCartStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe(mockProduct.id);
    expect(cart[0].quantity).toBe(1);
  });

  it("should show quantity in cart after adding product", async () => {
    const user = userEvent.setup();
    render(<Card product={mockProduct} />);

    const addButton = screen.getByText("Add to Cart").closest("button");
    await user.click(addButton!);

    await waitFor(() => {
      expect(screen.getByText("1 in cart")).toBeInTheDocument();
    });
  });

  it("should increment quantity when clicking add button multiple times", async () => {
    const user = userEvent.setup();
    render(<Card product={mockProduct} />);

    const addButton = screen.getByText("Add to Cart").closest("button");
    await user.click(addButton!);
    
    await waitFor(() => {
      expect(screen.getByText("1 in cart")).toBeInTheDocument();
    });

    await user.click(addButton!);

    await waitFor(() => {
      expect(screen.getByText("2 in cart")).toBeInTheDocument();
    });

    const cart = useCartStore.getState().cart;
    expect(cart[0].quantity).toBe(2);
  });

  it("should show remove button when product is in cart", async () => {
    const user = userEvent.setup();
    render(<Card product={mockProduct} />);

    const addButton = screen.getByText("Add to Cart").closest("button");
    await user.click(addButton!);

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  it("should decrement quantity when clicking minus button", async () => {
    const user = userEvent.setup();
    render(<Card product={mockProduct} />);

    // Add product twice
    const addButton = screen.getByText("Add to Cart").closest("button");
    await user.click(addButton!);
    await user.click(addButton!);

    await waitFor(() => {
      expect(screen.getByText("2 in cart")).toBeInTheDocument();
    });

    // Click minus button
    const buttons = screen.getAllByRole("button");
    const minusButton = buttons.find((btn: HTMLElement) =>
      btn.querySelector("svg.lucide-minus")
    );
    await user.click(minusButton!);

    await waitFor(() => {
      expect(screen.getByText("1 in cart")).toBeInTheDocument();
    });
  });

  it("should remove product completely when clicking remove button", async () => {
    const user = userEvent.setup();
    render(<Card product={mockProduct} />);

    // Add product
    const addButton = screen.getByText("Add to Cart").closest("button");
    await user.click(addButton!);

    await waitFor(() => {
      expect(screen.getByText("1 in cart")).toBeInTheDocument();
    });

    // Click remove button (CircleX icon)
    const buttons = screen.getAllByRole("button");
    const removeButton = buttons.find((btn: HTMLElement) =>
      btn.querySelector("svg.lucide-circle-x")
    );
    await user.click(removeButton!);

    await waitFor(() => {
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    const cart = useCartStore.getState().cart;
    expect(cart).toHaveLength(0);
  });

  it("should disable add button when stock limit is reached", async () => {
    const user = userEvent.setup();
    const limitedProduct = { ...mockProduct, stock: 2 };
    render(<Card product={limitedProduct} />);

    const addButton = screen.getByText("Add to Cart").closest("button");

    // Add to stock limit
    await user.click(addButton!);
    await user.click(addButton!);

    await waitFor(() => {
      expect(addButton).toBeDisabled();
    });
  });

  it("should not show remove buttons when product not in cart", () => {
    render(<Card product={mockProduct} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1); // Only the "Add to Cart" button
  });
});
