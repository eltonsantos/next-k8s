FROM postgres:16-alpine

# Copiar script de inicialização do banco de dados
COPY init.sql /docker-entrypoint-initdb.d/

# Definir variáveis de ambiente padrão para o PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB taskmanager

# Expor a porta padrão do PostgreSQL
EXPOSE 5432