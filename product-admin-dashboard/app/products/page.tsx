import { Suspense } from "react";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import Loader from "@/components/common/Loader";

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsPageContent />
    </Suspense>
  );
}
