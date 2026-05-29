# CaseCellShop - Módulo de Checkout

Este repositório contém a implementação do fluxo de checkout do **CaseCellShop**, um e-commerce fictício de capinhas de celular. O projeto foi construído utilizando **Next.js (App Router)** com **TypeScript** e **Chakra UI v2** para o frontend.

---

## Como Rodar o Projeto Localmente

### 1. Instalação das Dependências
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado. No terminal, na raiz do projeto, execute:
```bash
npm install
```

### 2. Configurando o Ambiente
Crie um arquivo `.env` ou `.env.local` baseado no `.env.example`:
```bash
cp .env.example .env.local
```
Preencha as variáveis de ambiente necessárias (as chaves já possuem valores fictícios práticos). 

### 3. Rodando em Modo de Desenvolvimento (Frontend + API)
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador. O frontend de seleção de capinhas estará visível e integrado à API local.

### 4. Build de Produção
Para compilar e otimizar a aplicação para produção:
```bash
npm run build
npm run start
```

### 5. Executando os Testes Automatizados
O projeto conta com uma suíte de testes de integração na API utilizando **Vitest**. Para rodar todos os testes com um único comando, digite:
```bash
npm run test
```
Este comando validará:
- Formato de entrada (HTTP 400).
- Produto não encontrado (HTTP 404).
- Estoque insuficiente (HTTP 422).
- Simulação de queda do serviço/ERP (HTTP 503).
- Sucesso com dedução de estoque (HTTP 201).

---

## Decisões de Arquitetura e Trade-offs

1. **Uso de Banco de Dados em Memória (MVP Ágil)**
   - **Decisão:** Ao invés de configurar de imediato um banco relacional como PostgreSQL ou MongoDB com um ORM, adotamos um arquivo TypeScript simulando estado em memória (`mockDb.ts`).
   - **Trade-off:** A memória reseta cada vez que o servidor (Node.js) é reiniciado, perdendo os registros de "stock". O lado positivo é a velocidade brutal de setup para validar o frontend e os fluxos lógicos de negócio sem depender de instâncias externas, perfeito para o escopo de um MVP.

2. **Tratamento de Erros e Resiliência HTTP**
   - **Decisão:** A API de Checkout retorna Status Codes bem mapeados (ex: 422 para regras de negócio não atendidas e 503 Service Unavailable). Para simular sistemas on-premise falhos, injetamos uma lógica onde requisições com quantidade = 999 emitem intencionalmente um 503.
   - **Vantagem:** O frontend já foi construído para lidar graciosamente com falhas sistêmicas (mostrando mensagens coloridas e claras pro usuário final) antes mesmo da aplicação estar ligada num ambiente de risco real.

3. **Injeção de CSS em Server Components (Chakra UI + Next 16/React 19)**
   - **Decisão:** Tivemos de sobrescrever o `CacheProvider` nativo do Chakra UI por uma implementação manual via `@emotion/cache` e `useServerInsertedHTML`.
   - **Por quê?** Mismatches de hidratação (Hydration Errors) são comuns com App Router. Escrever o Provider manualmente garantiu compatibilidade irrestrita com as versões mais recentes do React.

