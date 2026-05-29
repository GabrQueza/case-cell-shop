'use client';

import { useState } from 'react';
import { 
  Box, Button, FormControl, FormLabel, Select, NumberInput, NumberInputField, 
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, 
  VStack, Heading, Alert, AlertIcon, Text 
} from '@chakra-ui/react';
import type { Product } from '@/backend/mockDb';

export function CheckoutForm({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setMessage({ type: 'warning', text: 'Por favor, selecione um produto.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProductId, quantity })
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage({ type: 'success', text: `Sucesso! Pedido ${data.orderId} confirmado.` });
      } else if (response.status === 400 || response.status === 422) {
        setMessage({ type: 'error', text: data.error });
      } else if (response.status === 503) {
        setMessage({ type: 'error', text: 'O sistema está temporariamente instável, por favor tente novamente em alguns instantes.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ocorreu um erro inesperado.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao se conectar com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="md" mb={6}>Finalizar Compra</Heading>

      {message && (
        <Alert status={message.type} mb={6} borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">{message.text}</Text>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Produto</FormLabel>
            <Select 
              placeholder="Selecione a capinha" 
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {initialProducts.map((p: Product) => (
                <option key={p.id} value={p.id}>
                  {p.name} - R$ {p.price.toFixed(2)} (Estoque: {p.stock})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Quantidade</FormLabel>
            <NumberInput 
              min={1} 
              max={999} 
              value={quantity} 
              onChange={(_, val) => setQuantity(val)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full" 
            isLoading={loading}
            loadingText="Processando..."
            isDisabled={loading}
          >
            Finalizar Compra
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
