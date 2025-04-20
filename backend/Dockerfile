FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema necessárias e pnpm
RUN apk --no-cache add dumb-init && npm install -g pnpm

# Copiar os arquivos de configuração do projeto
COPY package*.json ./

# Instalar as dependências usando pnpm
RUN pnpm install --prod --frozen-lockfile

# Copiar o código-fonte da aplicação
COPY . .

# Criar um usuário não-root para executar a aplicação
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs node_user && \
    chown -R node_user:nodejs /app

# Mudar para o usuário não-root
USER node_user

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Expor a porta que a aplicação irá utilizar
EXPOSE 3001

# Usar dumb-init como processo inicial para lidar corretamente com sinais do sistema
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]