import { Card } from "@/components/Card";
import { AutoCompleteInputComponent } from "@/components/SearchInput";
import { Product } from "@/store/cart";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PRODUCT_COUNT = 8;

const Home = () => {
  const [skipCount, setSkipCount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const apiQuery = useQuery({
    queryKey: ["products", skipCount, searchValue],
    queryFn: () =>
      fetch(
        `https://dummyjson.com/products/search?q=${searchValue}&limit=${PRODUCT_COUNT}&skip=${skipCount}`
      ).then((res) => res.json()),
  });

  useEffect(() => {
    if (apiQuery.isSuccess) {
      if (skipCount === 0) {
        setProducts(apiQuery.data.products);
      } else {
        setProducts((prev) => [...prev, ...apiQuery.data.products]);
      }
    }
  }, [apiQuery.data, apiQuery.isSuccess, skipCount]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      const total = apiQuery.data?.total || 0;

      if (
        target.isIntersecting &&
        !apiQuery.isFetching &&
        products.length < total
      ) {
        setSkipCount((prev) => prev + PRODUCT_COUNT);
      }
    },
    [apiQuery.isFetching, products.length, apiQuery.data?.total]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]);

  return (
    <div>
      <AutoCompleteInputComponent
        setSearchValue={setSearchValue}
        setSkipCount={setSkipCount}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {apiQuery.isPending &&
          skipCount === 0 &&
          Array.from({ length: PRODUCT_COUNT }).map((_, index) => (
            <div className="flex flex-col space-y-3" key={index}>
              <Skeleton className="h-[262px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        {products.length ? (
          products.map((product: Product) => (
            <Card product={product} key={product.id} />
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
      <div ref={observerRef} style={{ height: "50px" }} />
    </div>
  );
};

export default Home;
