SHELL := /bin/bash
.DEFAULT_GOAL := help

# Versão mínima do Node (lida de .nvmrc)
NODE_MAJOR := $(shell cat .nvmrc 2>/dev/null || echo 22)

# Garante Node >= NODE_MAJOR. Se a versão atual for menor, carrega via nvm.
# Precisa rodar na mesma linha de shell do comando, por isso é prefixado nas receitas.
ENSURE_NODE = if [ "$$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)" -lt "$(NODE_MAJOR)" ]; then export NVM_DIR="$${NVM_DIR:-$$HOME/.nvm}"; [ -s "$$NVM_DIR/nvm.sh" ] || { echo "Node >= $(NODE_MAJOR) é necessário (instale o nvm ou Node $(NODE_MAJOR))." >&2; exit 1; }; . "$$NVM_DIR/nvm.sh"; nvm install $(NODE_MAJOR) >/dev/null && nvm use $(NODE_MAJOR) >/dev/null || exit 1; fi;

.PHONY: help setup dev build start lint clean

help: ## Lista os comandos disponíveis
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-8s %s\n", $$1, $$2}'

setup: ## Instala as dependências (npm install)
	@$(ENSURE_NODE) npm install

dev: ## Sobe o servidor de dev em http://localhost:3000
	@$(ENSURE_NODE) npm run dev

build: ## Gera o build de produção
	@$(ENSURE_NODE) npm run build

start: ## Roda o build de produção
	@$(ENSURE_NODE) npm run start

lint: ## Roda o ESLint
	@$(ENSURE_NODE) npm run lint

clean: ## Remove .next e node_modules
	rm -rf .next node_modules
