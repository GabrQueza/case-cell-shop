# Registro de Prompts de IA Utilizados

Ao longo do desenvolvimento deste projeto, os seguintes prompts foram utilizados para orientar o agente de Inteligência Artificial (Antigravity):

## Prompt 1: Setup Inicial & Mock
> Estamos iniciando um projeto de fluxo de checkout para a CaseCellShop usando Next.js (App Router) com TypeScript. 
> Por favor, execute as seguintes tarefas iniciais:
> 1. Verifique se o arquivo `.gitignore` está configurado corretamente para ignorar a pasta `.next`, `node_modules`, arquivos `.env`, `.env.local` e coberturas de teste.
> 2. Crie um arquivo `.env.example` contendo apenas chaves fictícias necessárias, mas sem valores sensíveis.
> 3. Crie uma estrutura básica de pastas organizada (ex: /src/app, /src/components, /src/backend, /src/types).
> 4. No lado do backend (ou banco em memória), crie um arquivo de dados em memória (`src/backend/mockDb.ts`) que simule uma tabela de produtos e estoque. Cada produto deve ter id, nome, preço e quantidade em estoque (stock). Inclua pelo menos 3 modelos de capinhas de celular diferentes. Exporte funções para buscar produtos, atualizar o estoque na memória e resetar o estoque se necessário para testes.

## Prompt 2: Backend & Testes
> Altere para o contexto do backend. Preciso implementar o endpoint de checkout.
> Crie uma API Route no Next.js no caminho `src/app/api/checkout/route.ts` que aceite requisições `POST`.
> Requisitos da API:
> 1. Validação de Entrada: Deve receber um JSON contendo `productId` (string) e `quantity` (number). Se faltar algum dado ou a quantidade for menor ou igual a zero, retorne HTTP 400 Bad Request com uma mensagem clara.
> 2. Regra de Negócio (Estoque): Busque o produto no nosso mockDb. Se o produto não existir, retorne HTTP 404 Not Found. Se a quantidade solicitada for maior do que o estoque disponível, retorne HTTP 422 Unprocessable Entity (ou 409 Conflict) avisando que o estoque é insuficiente.
> 3. Simulação de Indisponibilidade/Erro: Para simular o cenário de instabilidade do ERP on-premise do case original, adicione uma lógica onde, se a quantidade solicitada for exatamente 999 (um valor de teste), a API deve simular um timeout ou erro interno do sistema, retornando HTTP 503 Service Unavailable.
> 4. Sucesso: Se passar por todas as validações, debite a quantidade do estoque em memória e retorne HTTP 201 Created com o ID de um pedido fictício gerado e o status atualizado.
> 
> Após criar a rota, configure o Jest (ou Vitest) e escreva testes unitários/de integração isolados para este endpoint cobrindo os 4 cenários acima (Sucesso, Erro de Validação, Falta de Estoque e Indisponibilidade 503).

## Prompt 3: Frontend & Interface (Chakra V2)
> Agora vamos trabalhar no Frontend. Crie um componente de tela de checkout simples e limpo na página principal (`src/app/page.tsx`) ou em um componente dedicado usando React, TypeScript e Chakra v2 (npm i @chakra-ui/react@2 @emotion/react @emotion/styled framer-motion)
> 
> Requisitos da UI:
> 1. Listagem/Seleção: Exiba os produtos disponíveis vindos do nosso mock (ou faça um fetch inicial de uma rota de produtos simples se preferir, ou consuma diretamente se for Server Component) para que o usuário escolha a capinha e digite a quantidade desejada através de um input numérico.
> 2. Estado de Carregamento (Loading): Quando o usuário clicar no botão "Finalizar Compra", mude o texto do botão para "Processando..." ou exiba um spinner.
> 3. Prevenção de Ações Duplicadas: Enquanto a requisição da API estiver em andamento, o botão de compra DEVE ser desabilitado (`disabled={loading}`) para evitar cliques duplos que gerariam pedidos duplicados.
> 4. Feedback Visual Claro: 
>    - Em caso de sucesso (HTTP 201), exiba um alerta ou box verde de sucesso com o número do pedido.
>    - Em caso de erro de validação ou falta de estoque (HTTP 400/422), exiba uma mensagem em vermelho explicando o motivo.
>    - Em caso de indisponibilidade do sistema (HTTP 503), exiba uma mensagem amigável informando que "O sistema está temporariamente instável, por favor tente novamente em alguns instantes".

## Prompt 4: Polimento
> Para finalizar o projeto, vamos fazer o polimento técnico e a documentação.
> 1. Verifique se todos os arquivos TypeScript estão tipados corretamente e sem erros de compilação.
> 2. Certifique-se de que os testes automatizados criados na Etapa 2 rodam perfeitamente com um único comando (ex: npm run test).
> 3. Crie um arquivo `README.md` completo e profissional contendo:
>    - Nome do projeto (CaseCellShop - Módulo de Checkout).
>    - Instruções claras de como rodar o projeto localmente (instalação de dependências, comandos de build, execução e testes).
>    - Uma seção dedicada a "Decisões de Arquitetura e Trade-offs", explicando o uso de dados em memória para agilidade do MVP e a abordagem de tratamento de erros HTTP resilientes (como o status 503).
>    - Uma seção de "Registro de Prompts de IA Utilizados", listando os blocos de instruções passados para o desenvolvimento deste fluxo (você pode consolidar os prompts anteriores aqui).

## Prompt da Parte 1.a: Consultoria Teórica

>Estou fazendo um projeto e primeiro estou na parte de perguntas conceituais do projeto. Ele tem esse contexto:

>"Você foi contratado(a) como Desenvolvedor(a) na CaseCellShop, uma empresa varejista focada na venda de capinhas para celular. A empresa está passando por um período de hipercrescimento: o que antes eram milhares de acessos diários na loja virtual, hoje se transformaram em milhões.

>Arquitetura atual

>ComponenteDescriçãoERP CentralERP monolítico que gerencia estoque, faturamento, financeiro e contábil. É o coração da empresa.Loja VirtualE-commerce que consome dados (produtos, preços, estoque) diretamente do ERP via API RESTful síncrona.Banco de DadosERP utiliza MySQL. Temos acesso de leitura, mas não podemos alterar rotinas, tabelas ou código interno do ERP.InfraestruturaTudo hospedado em datacenter próprio (on-premise) na sede.MonitoramentoFerramentas que monitoram performance e enviam alertas críticos.

>Dito isso, tenho algumas perguntas em que já respondi algumas:

>Pergunta 3 — SDD / contrato de API

>Que informações esse endpoint precisa receber?

>um array de JSON com informações do tipo id da compra, id do produto, valor, nome, quantidade etc.

>O que ele deve devolver em caso de sucesso?

>ele deve devolver o número de sucesso, como o 200 indicando que ele foi utilizado corretamente.

>O que ele deve devolver em caso de erro?

>depende do tipo de erro, isso pode ser definido no back em si, mas há um padrão como 401 seria não autorizado, 404 é algo não achado, 500 etc. 

>Por que é importante definir esse contrato antes de escrever código?

>É essencial ter tudo definido antes de implementar, pois facilita o encaixamento de todos os componentes, estrutura de pastas, comunicação entre o front, back, infra etc. Além de deixar claro que precisa ser implementado exatamente, quais bibliotecas usar, como usar, quando usar, qual o procedimento em caso de erro de comunicação da API etc.

>Pergunta 4 — TDD: Test-Driven Development

>Sobre testes do mesmo endpoint POST /checkout:

>Que testes você escreveria para garantir que ele funciona corretamente? Liste pelo menos 3 cenários.

>E2E, Unitário e CI/CD. Para testes end to end nas APIS, Jest ou Vitest para unitários certificar componentes ou códigos específicos do projeto e CI/CD no GitHub actions para não ter problema de conflito ou que quebrem o deploy quando outras pessoas fizeram PRs e branches no projeto.

>Há vantagem em escrever os testes antes de implementar a rota? Por quê?

>É uma prática recomendada, pois ajuda a pensar sobre os casos de uso e garantir que a rota seja implementada corretamente. Além disso, os testes podem ser usados para documentar a rota e garantir que ela seja usada corretamente."

>Sendo assim,gostaria de verificar se minhas respostas fazem sentido e lembrar de alguns conceitos como o que cada código na API como 200, 201, 401, 404, 502 detalha sobre a resposta. Além disso, eu estou com dúvida se minha justificativa de e2e e jest por exemplo, para códigos unitários ou até o uso de CI/CD com um teste automatizado para o github actions fazem sentido para a pergunta."

