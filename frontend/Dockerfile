# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copia os arquivos de configuração
COPY package.json pnpm-lock.yaml* ./

# Instala as dependências
RUN pnpm install --frozen-lockfile

# Copia o código fonte
COPY . .

# Constrói o aplicativo
RUN pnpm run build

# Estágio de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV production

# Adiciona um usuário não-root para executar a aplicação
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Copia os arquivos necessários para a execução
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Define o usuário
USER nextjs

# Expõe a porta
EXPOSE 3000

# Define a variável de ambiente para o endereço do host
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]