import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoaderPinwheel } from "lucide-react";
import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./app/layout";

const Home = React.lazy(() => import("@/components/Home"));
const Cart = React.lazy(() => import("@/components/Cart"));
const Checkout = React.lazy(() => import("@/components/Checkout"));
const Table = React.lazy(() => import("@/components/Table"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/">
        <Layout>
          <div>
            <div className="mx-auto px-10 pb-10">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full h-full p-4">
                    <LoaderPinwheel
                      className="animate-spin stroke-yellow-400"
                      size={50}
                      strokeWidth="1"
                    />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/table" element={<Table />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
