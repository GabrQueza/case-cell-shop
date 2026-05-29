import { NextResponse } from 'next/server';
import { getProductById, updateStock } from '../../../backend/mockDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    // 1. Validação de Entrada
    if (!productId || typeof productId !== 'string' || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: 'Formato inválido. productId deve ser uma string e quantity um número maior que zero.' },
        { status: 400 }
      );
    }

    // 3. Simulação de Indisponibilidade/Erro
    if (quantity === 999) {
      return NextResponse.json(
        { error: 'Service Unavailable - Falha ao comunicar com ERP' },
        { status: 503 }
      );
    }

    // 2. Regra de Negócio (Estoque)
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado.' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Estoque insuficiente.' },
        { status: 422 }
      );
    }

    // 4. Sucesso
    const updated = updateStock(productId, quantity);
    if (!updated) {
      return NextResponse.json(
        { error: 'Erro ao processar estoque.' },
        { status: 409 }
      );
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json(
      {
        message: 'Pedido criado com sucesso!',
        orderId,
        status: 'CONFIRMED'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Corpo da requisição inválido.' },
      { status: 400 }
    );
  }
}
