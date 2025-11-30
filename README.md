# Frontend MCP Monorepo

Monorepo que demonstra uma arquitetura "quase produção" para design system centralizado com **Storybook**, **MCP HTTP server standalone** e apps de times consumindo via workspace.

## 🎯 Visão Geral

Este monorepo simula um ambiente de produção onde:

- **`packages/design-system`** é o repositório central real:
  - Design System (componentes React)
  - Storybook (documentação do design system)
  - MCP HTTP server standalone (lê o build estático do Storybook)
  - Dockerfile para deploy do MCP server

- **`packages/demo-timeA`** e **`packages/demo-timeB`** são apps de times que:
  - Consomem o pacote `@org/design-system` via workspace
  - Não conhecem o código interno do design system
  - Usam o endpoint MCP HTTP exposto pelo design system

### Arquitetura

```
┌─────────────────────────────────────┐
│   packages/design-system            │
│   ├── Design System (React)         │
│   ├── Storybook (docs)              │
│   ├── MCP HTTP Server               │
│   └── Dockerfile (produção)         │
└─────────────────────────────────────┘
           │                    │
           │ npm workspace      │ HTTP MCP
           │                    │
    ┌──────┴──────┐    ┌────────┴────────┐
    │ demo-timeA  │    │   demo-timeB    │
    │ (port 3000) │    │   (port 3001)   │
    │ packages/   │    │   packages/     │
    └────────────┘    └─────────────────┘
```

## 📋 Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **pnpm** 8+ (ou npm/yarn com workspaces)
- **Docker** (para modo produção)
- **Cursor** ou **VS Code** (com suporte a MCP)

## 🚀 Modo Dev (Local)

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Build do Storybook do Design System

Primeiro, construa o build estático do Storybook:

```bash
pnpm --filter @org/design-system storybook:build
```

Isso gera `packages/design-system/storybook-static/` com os arquivos necessários.

### 3. Subir MCP Server Local

Em um terminal, inicie o servidor MCP:

```bash
pnpm --filter @org/design-system mcp:dev
```

O servidor estará disponível em:
- **MCP endpoint:** `http://localhost:13316/mcp`
- **Health check:** `http://localhost:13316/healthz`

### 4. Subir Storybook (opcional, para visualização)

Em outro terminal:

```bash
pnpm storybook
```

Storybook estará em `http://localhost:6006`.

### 5. Subir Apps de Times

Em terminais separados:

```bash
# Time A
pnpm demo-timeA:dev
# ou: pnpm --filter demo-timeA dev
# App em http://localhost:3000

# Time B
pnpm demo-timeB:dev
# ou: pnpm --filter demo-timeB dev
# App em http://localhost:3001
```

### 6. Configurar Cursor/VS Code para MCP

Cada app tem seu próprio `.cursor/mcp.json` apontando para o servidor MCP:

```json
{
  "mcpServers": {
    "org-design-system-mcp": {
      "transport": "http",
      "url": "http://localhost:13316/mcp"
    }
  }
}
```

Recarregue o editor para detectar a configuração.

## 🐳 Modo "Produção Simulada" (Docker)

### 1. Build do Storybook

```bash
pnpm --filter @org/design-system storybook:build
```

### 2. Build do MCP Server

```bash
pnpm --filter @org/design-system mcp:build
```

### 3. Build da Imagem Docker

```bash
pnpm --filter @org/design-system docker:build
```

Isso cria a imagem `org/design-system-mcp:local`.

### 4. Rodar Container

```bash
pnpm --filter @org/design-system docker:run
```

O container expõe o MCP server na porta `13316`.

### 5. Em Produção Real

Em produção real, você teria:

- **Terraform** provisionando:
  - Cluster Kubernetes (ou Lambda/API Gateway)
  - Service/Ingress para expor `https://design-system-mcp.sua-empresa.com/mcp`
  
- **CI/CD** fazendo:
  - Build do Storybook
  - Build do MCP server
  - Build da imagem Docker
  - Push para registry
  - Deploy no cluster

- **Apps de times** usando:
  - Pacote `@org/design-system` do npm registry
  - URL do MCP server via env var: `MCP_STORYBOOK_URL`

## 📁 Estrutura do Monorepo

```
.
├── packages/
│   ├── design-system/           # Design System Central
│   │   ├── src/
│   │   ├── .storybook/
│   │   ├── storybook-static/    # Build estático (gerado)
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── demo-timeA/              # App do Time A
│   │   ├── src/
│   │   ├── .cursor/mcp.json    # Config MCP local
│   │   └── package.json
│   └── demo-timeB/              # App do Time B
│       ├── src/
│       ├── .cursor/mcp.json    # Config MCP local
│       └── package.json
│       ├── src/
│       │   ├── components/      # Componentes React
│       │   ├── mcp-server/      # MCP HTTP server
│       │   └── index.ts         # Exports públicos
│       ├── .storybook/          # Config Storybook
│       ├── storybook-static/    # Build estático (gerado)
│       ├── Dockerfile           # Imagem para produção
│       └── package.json
├── turbo.json                   # Config Turborepo
├── package.json                 # Workspace root
├── tsconfig.base.json           # TS config compartilhado
├── AI_RULES.md                  # Regras e comandos para IA
└── README.md                    # Este arquivo
```

## 🔧 Scripts Disponíveis

### Raiz do Monorepo

- `pnpm dev` - Inicia todos os apps em modo dev
- `pnpm build` - Build de todos os pacotes
- `pnpm storybook` - Inicia Storybook do design system
- `pnpm storybook:build` - Build estático do Storybook
- `pnpm mcp:dev` - Inicia MCP server em modo dev
- `pnpm mcp:build` - Build do MCP server

### Design System (`packages/design-system`)

- `pnpm --filter @org/design-system storybook` - Storybook dev
- `pnpm --filter @org/design-system storybook:build` - Build estático
- `pnpm --filter @org/design-system mcp:dev` - MCP server dev
- `pnpm --filter @org/design-system mcp:build` - Build MCP
- `pnpm --filter @org/design-system mcp:start` - Inicia MCP (produção)
- `pnpm --filter @org/design-system docker:build` - Build Docker
- `pnpm --filter @org/design-system docker:run` - Roda container

### Apps

- `pnpm demo-timeA:dev` - Dev do Time A
- `pnpm demo-timeB:dev` - Dev do Time B

## 🔌 Endpoint MCP

O servidor MCP expõe:

- **POST `/mcp`** - Protocolo MCP
  - `tools/list` - Lista tools disponíveis
  - `tools/call` - Executa tools:
    - `list_components` - Lista todos os componentes
    - `find_component_by_name` - Busca componente por nome
    - `get_component_stories` - Obtém stories de um componente
    - `suggest_composition` - Sugere composição para um caso de uso

- **GET `/healthz`** - Health check
  - Retorna status, número de stories carregadas, etc.

## 🌍 Variáveis de Ambiente

### MCP Server

- `PORT` - Porta do servidor (default: `13316`)
- `STORYBOOK_STATIC_PATH` - Caminho do build estático (default: `storybook-static`)
- `LOG_LEVEL` - Nível de log: `debug`, `info`, `warn`, `error` (default: `info`)
- `NODE_ENV` - Ambiente: `development` ou `production`

### Apps (Produção)

- `MCP_STORYBOOK_URL` - URL do servidor MCP em produção
  - Exemplo: `https://design-system-mcp.interna/mcp`

## 📖 Como Usar com IA

Consulte [`AI_RULES.md`](./AI_RULES.md) para:

- Regras de comportamento da IA
- Comandos prontos para usar
- Fluxo de trabalho recomendado

### Exemplo Rápido

1. Inicie o MCP server: `pnpm mcp:dev`
2. Abra o Cursor/VS Code em um dos apps
3. No chat, digite:
   ```
   Use o MCP org-design-system-mcp para listar todos os componentes disponíveis e me sugerir uma tela de onboarding.
   ```
4. A IA usará o MCP para descobrir componentes e gerar código

## 🐛 Troubleshooting

### MCP Server não encontra Storybook

1. Certifique-se de que rodou `storybook:build`:
   ```bash
   pnpm --filter @org/design-system storybook:build
   ```
2. Verifique se `packages/design-system/storybook-static/index.json` existe
3. Verifique a variável `STORYBOOK_STATIC_PATH` no servidor

### Apps não encontram `@org/design-system`

1. Certifique-se de que rodou `pnpm install` na raiz
2. Verifique se o workspace está configurado corretamente no `package.json` raiz

### Docker build falha

1. Certifique-se de que o Storybook foi buildado antes
2. Verifique se todos os arquivos necessários estão presentes
3. Ajuste o Dockerfile se necessário para seu ambiente

## 🎓 Próximos Passos

1. Explore os componentes no Storybook: `http://localhost:6006`
2. Teste o MCP server: `http://localhost:13316/healthz`
3. Experimente os comandos do `AI_RULES.md`
4. Crie novos componentes no design system
5. Use os componentes nos apps de times
6. Simule deploy em produção com Docker

## 📝 Notas Importantes

- **Não use `@storybook/mcp`**: Este projeto implementa um servidor MCP HTTP próprio
- **MCP server lê build estático**: O servidor lê `storybook-static/index.json` para descobrir componentes
- **Workspace local**: Em produção, os apps instalariam `@org/design-system` de um npm registry
- **Portas fixas em dev**: 
  - Storybook: `6006`
  - MCP: `13316`
  - Time A: `3000`
  - Time B: `3001`

## 📄 Licença

Este é um projeto de demonstração. Sinta-se livre para usar como base.

---

**Desenvolvido para demonstrar arquitetura de design system centralizado com MCP em ambiente quase-produção.**
