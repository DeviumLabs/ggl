# Instalar dependências (usa o pnpm-lock.yaml; o pnpm é ativado pelo corepack)
pnpm install --frozen-lockfile

# Iniciar em modo desenvolvimento
pnpm run dev

# Ou, com Node 22 e pnpm gerenciados automaticamente:
make setup
make dev
# Acesse: http://localhost:3000