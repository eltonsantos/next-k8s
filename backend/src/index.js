const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const winston = require('winston');

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME || 'taskmanager',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'database',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Permitir recursos cross-origin
})); // Segurança
app.use(cors({
  origin: '*', // Permitir qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Habilitar CORS
app.use(express.json()); // Parser para JSON
app.use(morgan('dev')); // Logging HTTP

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  logger.info(`Requisição recebida: ${req.method} ${req.url}`);
  logger.info(`Body: ${JSON.stringify(req.body)}`);
  next();
});

// Configuração das rotas
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is running' });
});

// Versão de API
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is running' });
});

// Importar modelos
const Task = require('./models/task')(sequelize);

// Importar e usar rotas
const taskRoutes = require('./routes/taskRoutes')(Task);

// Registrar rotas em ambos os caminhos para compatibilidade
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Algo deu errado' : err.message
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  logger.info(`Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found', message: 'Rota não encontrada' });
});

// Inicializar o servidor
const startServer = async () => {
  try {
    // Autenticar no banco de dados
    await sequelize.authenticate();
    logger.info('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincronizar modelos com o banco de dados
    await sequelize.sync();
    logger.info('Modelos sincronizados com o banco de dados.');

    // Iniciar o servidor
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Lidar com rejeições não tratadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejeição não tratada em:', promise, 'razão:', reason);
});

// Lidar com exceções não tratadas
process.on('uncaughtException', (error) => {
  logger.error('Exceção não tratada:', error);
  process.exit(1); // É uma boa prática encerrar o aplicativo após uma exceção não tratada
});

// Iniciar o servidor
startServer();

// Exportar para testes
module.exports = app;