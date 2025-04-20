# Task Manager - Aplicação Completa com Docker e Kubernetes

Este é um projeto de gerenciamento de tarefas com uma arquitetura completa usando:
- Frontend com Next.js e Tailwind CSS
- Backend com Node.js e Express
- Banco de dados PostgreSQL
- Docker para containerização
- Kubernetes para orquestração
- CI/CD com GitHub Actions

## Estrutura do Projeto

```
.
├── frontend/            # Aplicação Next.js
├── backend/             # API com Express
├── database/            # Configurações do PostgreSQL
├── kubernetes/          # Configurações do Kubernetes
├── .github/workflows/   # Configurações CI/CD
└── docker-compose.yaml  # Configuração para desenvolvimento local
```

## Executando com Docker Compose (Desenvolvimento)

Para iniciar a aplicação localmente usando Docker:

```bash
# Construir as imagens
docker compose build

# Iniciar os serviços
docker compose up -d

# Verificar os logs
docker compose logs -f
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Banco de dados: localhost:5432

## Integração com Kubernetes

### Por que usar Kubernetes nesta aplicação?

O Kubernetes oferece várias vantagens para esta aplicação:

1. **Escalabilidade automática**: Aumenta ou diminui o número de instâncias de cada serviço conforme a demanda.
2. **Alta disponibilidade**: Garante que a aplicação permaneça disponível mesmo durante falhas ou atualizações.
3. **Atualizações sem interrupção**: Permite atualizar componentes sem afetar os usuários.
4. **Gerenciamento de configuração**: Separa as configurações do código através de ConfigMaps e Secrets.
5. **Auto-recuperação**: Reinicia automaticamente componentes com falha.
6. **Distribuição de carga**: Balanceia requisições entre múltiplas instâncias.
7. **Isolamento de recursos**: Limita quanto de CPU e memória cada componente pode usar.

### Configurações do Kubernetes

Esta aplicação está configurada com os seguintes recursos Kubernetes:

- **Namespace**: Isolamento lógico para todos os recursos da aplicação
- **Deployments**: Para frontend, backend e banco de dados
- **Services**: Exposição da rede interna para cada componente
- **Ingress**: Roteamento de tráfego externo para os serviços
- **ConfigMaps e Secrets**: Gerenciamento de configurações e dados sensíveis
- **PersistentVolumeClaims**: Armazenamento persistente para o banco de dados
- **Health Checks**: Verificações de saúde para garantir a disponibilidade

### Testando no Kind (Kubernetes in Docker)

Para testar a aplicação no Kubernetes localmente usando Kind:

```bash
# Criar um cluster Kind (se ainda não existir)
kind create cluster

# Aplicar os arquivos de configuração Kubernetes
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/config.yaml
kubectl apply -f kubernetes/postgres-pvc.yaml
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/postgres-service.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
kubectl apply -f kubernetes/ingress.yaml

# Verificar o status dos pods
kubectl get pods -n task-manager

# Verificar os serviços
kubectl get services -n task-manager

# Verificar o ingress
kubectl get ingress -n task-manager
```

### Como acessar a aplicação no Kind

Para acessar a aplicação no Kind, você precisa configurar o port-forwarding:

```bash
# Port-forward para o frontend
kubectl port-forward -n task-manager svc/frontend 8080:80

# Em outro terminal, port-forward para o backend
kubectl port-forward -n task-manager svc/backend 8081:80
```

Agora você pode acessar:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8081

### Escalando a aplicação

Uma das principais vantagens do Kubernetes é a capacidade de escalar facilmente:

```bash
# Escalar o backend para 5 réplicas
kubectl scale deployment backend -n task-manager --replicas=5

# Escalar o frontend para 3 réplicas
kubectl scale deployment frontend -n task-manager --replicas=3
```

### Autoscaling

Para configurar o escalonamento automático baseado em uso de CPU:

```bash
# Criar um HorizontalPodAutoscaler para o backend
cat <<EOF | kubectl apply -f -
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: task-manager
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF
```

### Atualizando a aplicação (Rolling Updates)

O Kubernetes permite atualizações sem interrupção:

```bash
# Atualizar a imagem do backend
kubectl set image deployment/backend -n task-manager backend=${GITHUB_USERNAME}/task-manager-api:nova-versao

# Verificar o status da atualização
kubectl rollout status deployment/backend -n task-manager

# Se necessário, reverter a atualização
kubectl rollout undo deployment/backend -n task-manager
```

## Implantação em Produção

### Provedores de Kubernetes Gerenciado

Esta aplicação pode ser implantada em qualquer provedor de Kubernetes:

- Google Kubernetes Engine (GKE)
- Amazon Elastic Kubernetes Service (EKS)
- Microsoft Azure Kubernetes Service (AKS)
- Digital Ocean Kubernetes
- IBM Cloud Kubernetes Service
- Red Hat OpenShift

### CI/CD Pipeline

A aplicação está configurada com um pipeline CI/CD que:

1. Executa testes em pull requests
2. Constrói e publica imagens Docker no GitHub Container Registry
3. Implanta automaticamente no Kubernetes quando há push na branch main

O pipeline é definido em `.github/workflows/ci-cd.yaml`.

### Monitoramento

Para monitorar a aplicação em produção, considere adicionar:

- **Prometheus**: Coleta de métricas
- **Grafana**: Visualização de métricas e dashboards
- **Loki**: Agregação de logs
- **Jaeger**: Rastreamento distribuído

## Detalhes da Implementação

### Frontend (Next.js)

- Aplicação moderna com React e Next.js
- Estilização com Tailwind CSS
- Comunicação com o backend via Axios
- Interface reativa e responsiva

### Backend (Express)

- API RESTful construída com Express
- Estruturação em camadas (controllers, routes, models)
- Validação de dados
- Logs com Winston
- Segurança com Helmet

### Banco de Dados (PostgreSQL)

- Uso do Sequelize como ORM
- Migrations para controle de esquema
- Dados persistentes através de volumes Docker e PVCs no Kubernetes

### Docker

- Multi-stage builds para imagens otimizadas
- Configuração para desenvolvimento e produção
- Uso de pnpm para instalação mais rápida de dependências

### Kubernetes

- Configuração de recursos para escalabilidade e resiliência
- Health checks para garantir disponibilidade
- Gerenciamento de segredos e configurações
- Ingress para roteamento de tráfego

## Solução de Problemas

### Docker

- **Erro de permissão**: `sudo chown -R $USER:$USER frontend/.next backend/node_modules`
- **Problemas de rede**: Verifique a rede `docker network inspect next-k8s_app-network`
- **Logs**: `docker logs task-manager-web` ou `docker logs task-manager-api`

### Kubernetes

- **Pods em CrashLoopBackOff**: `kubectl logs -n task-manager pod-name`
- **Problemas de conexão**: Verifique os services `kubectl get svc -n task-manager`
- **Verificar eventos**: `kubectl get events -n task-manager`
- **Descrição detalhada**: `kubectl describe pod -n task-manager pod-name`

## Desenvolvimento Futuro

Possíveis melhorias para o projeto:

- Autenticação de usuários
- Interface administrativa
- Categorização de tarefas
- Alertas e notificações
- Integração com calendários
- Versão mobile com React Native
- Deploy no GCP

## Licença

Este projeto está licenciado sob a licença MIT.