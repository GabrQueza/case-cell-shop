export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Capinha Transparente Anti-Impacto - iPhone 13',
    price: 49.90,
    stock: 20
  },
  {
    id: '2',
    name: 'Capinha de Silicone Aveludada - Galaxy S23',
    price: 59.90,
    stock: 15
  },
  {
    id: '3',
    name: 'Capinha de Couro Sintético - Motorola Edge 40',
    price: 79.90,
    stock: 10
  }
];

let products: Product[] = [...initialProducts.map(p => ({ ...p }))];

export const getProducts = (): Product[] => {
  return products;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const updateStock = (id: string, quantityToReduce: number): boolean => {
  const product = products.find(p => p.id === id);
  if (!product) return false;
  
  if (product.stock >= quantityToReduce) {
    product.stock -= quantityToReduce;
    return true;
  }
  
  return false;
};

export const resetStock = (): void => {
  products = initialProducts.map(p => ({ ...p }));
};
