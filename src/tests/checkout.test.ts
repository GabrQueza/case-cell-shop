import { expect, test, describe, beforeEach } from 'vitest';
import { POST } from '../app/api/checkout/route';
import { resetStock, getProductById } from '../backend/mockDb';

describe('Checkout API Route', () => {
  beforeEach(() => {
    resetStock();
  });

  const createRequest = (body: any) => {
    return new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  test('Deve retornar 400 Bad Request se os dados forem inválidos (falta productId)', async () => {
    const req = createRequest({ quantity: 1 });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/Formato inválido/);
  });

  test('Deve retornar 400 Bad Request se a quantidade for zero ou negativa', async () => {
    const req = createRequest({ productId: '1', quantity: 0 });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/Formato inválido/);
  });

  test('Deve retornar 404 Not Found se o produto não existir no mockDb', async () => {
    const req = createRequest({ productId: '999', quantity: 1 });
    const res = await POST(req);
    expect(res.status).toBe(404);

    const json = await res.json();
    expect(json.error).toBe('Produto não encontrado.');
  });

  test('Deve retornar 422 Unprocessable Entity se o estoque for insuficiente', async () => {
    const req = createRequest({ productId: '1', quantity: 21 });
    const res = await POST(req);
    expect(res.status).toBe(422);

    const json = await res.json();
    expect(json.error).toBe('Estoque insuficiente.');
  });

  test('Deve retornar 503 Service Unavailable se a quantidade solicitada for exatamente 999 (Simulação ERP)', async () => {
    const req = createRequest({ productId: '1', quantity: 999 });
    const res = await POST(req);
    expect(res.status).toBe(503);

    const json = await res.json();
    expect(json.error).toMatch(/Service Unavailable/);
  });

  test('Deve retornar 201 Created, deduzir o estoque e retornar o orderId em caso de sucesso', async () => {
    const initialProduct = getProductById('1');
    expect(initialProduct?.stock).toBe(20);

    const req = createRequest({ productId: '1', quantity: 2 });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.message).toBe('Pedido criado com sucesso!');
    expect(json.orderId).toBeDefined();
    expect(json.status).toBe('CONFIRMED');

    const updatedProduct = getProductById('1');
    expect(updatedProduct?.stock).toBe(18);
  });
});
