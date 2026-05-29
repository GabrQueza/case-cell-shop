import { CheckoutForm } from '@/components/CheckoutForm';
import { getProducts } from '@/backend/mockDb';

export default function HomePage() {
  const products = getProducts();

  return (
    <main style={{ padding: '2rem' }}>
      <CheckoutForm initialProducts={products} />
    </main>
  );
}
