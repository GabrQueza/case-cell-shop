import { CheckoutForm } from '@/components/CheckoutForm';
import { getProducts } from '@/backend/mockDb';

export default function HomePage() {
  const products = getProducts();

  return <CheckoutForm initialProducts={products} />;
}
