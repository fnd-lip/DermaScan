# DermaScan

O **DermaScan** é um projeto básico para classificação de lesões dermatológicas.

O sistema utiliza inteligência artificial para analisar imagens de lesões de pele e apresentar a classe prevista pelo modelo, as probabilidades das sete categorias disponíveis e alertas para classes que exigem maior atenção.

O projeto possui frontend em React, backend em Express.js, autenticação com JWT, banco PostgreSQL, serviço de inferência em Python com BentoML e histórico de análises separado por usuário.

## Acesso à aplicação

**Aplicação publicada na Vercel:** [Acessar o DermaScan](https://derma-scan-eta.vercel.app/)

## 1. Introdução

### 1.1 Contexto e motivação

A classificação de lesões dermatológicas é uma tarefa complexa, pois diferentes tipos de lesões podem apresentar características visuais semelhantes.

O DermaScan foi desenvolvido para demonstrar como técnicas de visão computacional podem ser integradas a uma aplicação completa, desde o treinamento do modelo até a disponibilização da classificação em uma interface web.

A aplicação permite enviar ou capturar uma imagem, consultar o resultado da análise e manter um histórico por usuário.

### 1.2 Problema

Como utilizar um modelo de visão computacional para auxiliar na classificação de imagens de lesões dermatológicas em sete categorias?

### 1.3 Hipótese

Imagens dermatoscópicas possuem padrões visuais que permitem que um modelo treinado por transferência de aprendizado classifique as sete classes do conjunto HAM10000 com desempenho superior a uma estratégia simples de sempre prever a classe mais frequente.

### 1.4 Objetivos

- Preparar e organizar as imagens do conjunto HAM10000.
- Treinar um modelo para classificação das sete classes dermatológicas.
- Avaliar o modelo com métricas adequadas para dados desbalanceados.
- Disponibilizar o modelo por meio de um serviço de inferência.
- Integrar o serviço de inteligência artificial ao frontend, backend e banco de dados.
- Apresentar avisos claros sobre as limitações do sistema.

### 1.5 Equipe

| Nome                       | E-mail                                                     | Papel principal           | Contribuição                                                                                                                                                                                  |
| -------------------------- | ---------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Samuel Moura Alves         | [samuelmalves1@gmail.com](mailto:samuelmalves1@gmail.com)  | Apresentação e Avaliação  | Preparação da apresentação e definição dos métodos de avaliação do modelo.                                                                                                                    |
| Felipe Barbosa de Lima     | [felipefnd@outlook.com](mailto:felipefnd@outlook.com)      | Frontend                  | Desenvolvimento da interface, integração com a API e validação do funcionamento da aplicação.                                                                                                 |
| José Airton Silva Marques  | [cadmo.en@gmail.com](mailto:cadmo.en@gmail.com)            | Machine Learning          | Concepção, arquitetura e implementação dos pipelines de treinamento e fine-tuning, além do ajuste de hiperparâmetros e pesos de classe para reduzir o impacto do desbalanceamento dos dados.  |
| Hailton David Lemos        | [hailton.david@gmail.com](mailto:hailton.david@gmail.com)  | Machine Learning          | Teste e validação do modelo.                                                                                                                                                                  |

## 2. Dados

### 2.1 Fonte e licença

O treinamento utiliza o conjunto de dados **HAM10000 - Human Against Machine with 10,000 training images**.

- Fonte: Kaggle
- Conjunto: `kmader/skin-cancer-mnist-ham10000`
- Página: <https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000>
- Licença: CC BY-NC 4.0
- Formato: imagens JPEG e metadados em CSV
- Uso: educacional e não comercial

### 2.2 Volume

| Informação                  | Quantidade |
| --------------------------- | ---------: |
| Imagens                     |     10.015 |
| Lesões identificadas        |      7.470 |
| Classes                     |          7 |
| Imagens sem caminho válido  |          0 |
| Rótulos ausentes            |          0 |

### 2.3 Classes

| Código   | Classe                 |
| -------- | ---------------------- |
| `akiec`  | Ceratose actínica      |
| `bcc`    | Carcinoma basocelular  |
| `bkl`    | Ceratose benigna       |
| `df`     | Dermatofibroma         |
| `mel`    | Melanoma               |
| `nv`     | Nevo melanocítico      |
| `vasc`   | Lesão vascular         |

### 2.4 Riscos dos dados

O conjunto possui forte desbalanceamento entre as classes com maior concentração de imagens de nevos melanocíticos.

Também existem riscos relacionados a:

- baixa quantidade de exemplos em algumas classes
- diferenças de iluminação e qualidade das imagens
- imagens diferentes pertencentes à mesma lesão
- possibilidade do modelo ter desempenho inferior em imagens diferentes das utilizadas no treinamento
- limitações de representação do conjunto de dados

### 2.5 Pré-processamento

O pipeline realiza:

- validação dos metadados e das imagens;
- conversão das imagens para RGB;
- redimensionamento para 380 × 380 pixels;
- normalização com os valores do ImageNet;
- aumento de dados no conjunto de treino;
- tratamento do desbalanceamento por pesos de classe;
- separação dos dados por `lesion_id`.

### 2.6 Divisão dos dados

| Conjunto   | Imagens | Lesões |
| ---------- | ------: | -----: |
| Treino     |   6.410 |  4.781 |
| Validação  |   1.608 |  1.195 |
| Teste      |   1.997 |  1.494 |

A separação foi realizada por `lesion_id`, evitando que imagens da mesma lesão aparecessem em conjuntos diferentes.

## 3. Metodologia

### 3.1 Abordagem

O problema foi tratado como uma classificação supervisionada multiclasse de imagens.

O modelo principal utiliza uma **EfficientNet-B4** pré-treinada no ImageNet e adaptada para as sete classes do HAM10000.

### 3.2 Configuração principal

| Parâmetro                    | Valor                            |
| ---------------------------- | -------------------------------- |
| Arquitetura                  | EfficientNet-B4                  |
| Entrada                      | 380 × 380 pixels                 |
| Semente                      | 42                               |
| Batch size                   | 8                                |
| Otimizador                   | AdamW                            |
| Estratégia de balanceamento  | Pesos efetivos de classe         |
| Data augmentation            | Sim                              |
| Fine-tuning                  | Sim                              |
| EMA                          | Sim                              |
| Calibração                   | Regressão logística multinomial  |
| Test-time augmentation       | Sim                              |

### 3.3 Baseline

Como baseline trivial, foi calculado o desempenho de uma estratégia que sempre prevê a classe mais frequente do conjunto de teste (`nv`).

Esse baseline permite verificar se o modelo realmente aprendeu padrões das imagens ou apenas reproduziu o desbalanceamento dos dados.

### 3.4 Validação

O protocolo de avaliação utiliza:

- conjuntos de treino, validação e teste separados
- divisão por `lesion_id`
- semente fixa
- teste congelado
- métricas globais e por classe
- calibração utilizando somente a validação
- intervalos de confiança por bootstrap

### 3.5 Métricas

Foram utilizadas:

- acurácia
- balanced accuracy
- F1-macro
- ROC-AUC
- PR-AUC
- precisão e recall por classe
- matriz de confusão
- métricas de calibração

### 3.6 Pipeline

```mermaid
flowchart LR
    A["HAM10000"] --> B["Validação dos dados"]
    B --> C["Divisão por lesion_id"]
    C --> D["Pré-processamento"]
    D --> E["Treinamento da EfficientNet-B4"]
    E --> F["Calibração e avaliação"]
    F --> G["Exportação do modelo"]
    G --> H["Serviço BentoML"]
    H --> I["Backend Express"]
    I --> J["Frontend React"]
```

## 4. Cronograma

| Semana | Período         | Atividade                                                                                       | Status        |
| -----: | --------------- | ----------------------------------------------------------------------------------------------- | ------------- |
|      1 | 29/mai – 05/jun | Definição do problema e análise inicial dos dados                                               | Concluído     |
|      2 | 06–12/jun       | Preparação dos dados e criação dos conjuntos de treino, validação e teste                       | Concluído     |
|      3 | 13–19/jun       | Definição do baseline, das métricas e início do desenvolvimento do frontend                     | Concluído     |
|      4 | 20–26/jun       | Treinamento inicial do modelo e aprimoramento da aplicação                                      | Concluído     |
|      5 | 27/jun – 03/jul | Entrega 1 e refinamento do projeto após as orientações recebidas                                | Concluído     |
|      6 | 04–10/jul       | Ajuste de hiperparâmetros, fine-tuning, avaliação e calibração                                  | Concluído     |
|      7 | 11–17/jul       | Análise dos resultados, erros e limitações do modelo                                            | Concluído     |
|      8 | 18–24/jul       | Integração do modelo com o serviço de inferência, backend e frontend                            | Concluído     |
|      9 | 25–31/jul       | Testes da aplicação, documentação e preparação da apresentação                                  | Concluído     |
|     10 | 01–07/ago       | Revisão final do README, validação da demonstração, preparação dos slides e entrega do projeto  | Em andamento  |

## 5. Resultados

### 5.1 Comparação principal

| Modelo                 |   Acurácia | Balanced accuracy |   F1-macro |
| ---------------------- | ---------: | ----------------: | ---------: |
| Classe mais frequente  |     66,90% |            14,29% |     11,45% |
| EfficientNet-B4        | **85,73%** |        **70,38%** | **72,43%** |

O modelo apresentou desempenho superior ao baseline, principalmente nas métricas que consideram o desbalanceamento entre as classes.

### 5.2 Outras métricas

| Métrica                              | Resultado |
| ------------------------------------ | --------: |
| ROC-AUC macro                        |    95,25% |
| PR-AUC macro                         |    75,99% |
| ROC-AUC para melanoma                |    90,22% |
| PR-AUC para melanoma                 |    65,19% |
| Recall da classificação de melanoma  |    51,14% |

### 5.3 Interpretação

Os resultados indicam que o modelo aprendeu padrões relevantes das imagens e superou a previsão baseada apenas na classe mais frequente.

Mesmo assim, o recall da classificação de melanoma mostra que ainda existem casos importantes não identificados corretamente. Por esse motivo, o sistema não deve ser utilizado como ferramenta de diagnóstico.

Os gráficos, matrizes de confusão e métricas por classe estão disponíveis no notebook de treinamento.

## 6. Arquitetura

```mermaid
flowchart LR
    U[Usuário] --> F[Frontend React]
    F --> B[Backend Express]
    B --> DB[(PostgreSQL)]
    B --> ML[Serviço BentoML]
    ML --> M[Modelo PyTorch]
```

A estrutura principal do repositório é:

```text
dermascan/
├── frontend/
├── backend/
├── ml-service/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .github/workflows/
└── README.md
```

## 7. Tecnologias principais

### Inteligência artificial

- Python 3.11
- PyTorch
- TorchVision
- timm
- scikit-learn
- BentoML

### Frontend

- React
- TypeScript
- Vite
- Playwright

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma
- JWT

### Infraestrutura

- PostgreSQL
- Docker
- Docker Compose
- GitHub Actions
- SonarQube

## 8. Funcionalidades

- cadastro e login de usuário
- autenticação com JWT
- sessão persistente
- captura ou envio de imagem
- validação da imagem
- classificação com o modelo de inteligência artificial
- exibição das probabilidades por classe
- alertas para classes de maior atenção
- histórico de análises por usuário
- exclusão de análises
- conteúdos educativos
- avisos sobre as limitações do sistema
- interface para demonstração

## 9. Como executar

### 9.1 Clonar o repositório

```bash
git clone [PREENCHER URL DO REPOSITÓRIO]
cd dermascan
```

### 9.2 Variáveis de ambiente da raiz

Crie um arquivo `.env` na raiz:

```env
POSTGRES_PASSWORD="SUA_SENHA_POSTGRES"
```

### 9.3 Variáveis de ambiente do backend

Crie `backend/.env`:

```env
PORT=4000
FRONTEND_URL="http://localhost:5173"
DATABASE_URL="postgresql://dermascan:SUA_SENHA_POSTGRES@127.0.0.1:5432/dermascan_db?schema=public"
JWT_SECRET="GERE_UM_SEGREDO_ALEATORIO_FORTE"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
ML_SERVICE_URL="http://localhost:5001"
```

Use a mesma senha configurada em `POSTGRES_PASSWORD`.

### 9.4 Banco de dados

Na raiz:

```bash
docker compose up -d
```

### 9.5 Serviço de inteligência artificial

Com Docker:

```bash
docker build -t dermascan-ml-service ./ml-service
docker run --rm -p 5001:5001 dermascan-ml-service
```

O serviço ficará disponível em:

```text
http://localhost:5001
```

### 9.6 Backend

```bash
cd backend
npm install
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:4000
```

### 9.7 Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

### 9.8 Execução com Docker Compose de produção

```bash
docker compose -f docker-compose.prod.yml up --build
```

## 10. Treinamento

O treinamento e a avaliação estão no notebook:

```text
ml-service/notebook/Classificacao_lesao.ipynb
```

O notebook contém:

- carregamento do HAM10000;
- validação dos dados;
- criação dos conjuntos;
- treinamento;
- calibração;
- avaliação;
- gráficos;
- exportação do modelo.

O modelo exportado é utilizado pelo serviço de inferência:

```text
ml-service/models/modelo_dermascan.pth
```

## 11. Testes e qualidade

### Frontend

```bash
cd frontend
npm run lint
npm run build
npx playwright test
```

### Backend

```bash
cd backend
npm run lint
npm run build
```

### Serviço de inteligência artificial

```bash
python -m compileall ml-service/src
docker build --no-cache -t dermascan-ml-service ml-service
```

O código também foi analisado com SonarQube e atingiu zero issues na análise mais recente.

## 12. Limitações 

O DermaScan possui limitações relacionadas ao conjunto de dados, à qualidade das imagens e ao desempenho do modelo.

O sistema:

- não fornece diagnóstico médico
- não substitui consulta com dermatologista
- pode produzir falsos positivos e falsos negativos
- pode apresentar resultados incorretos em imagens fora do padrão do treinamento
- não deve ser utilizado para decisões clínicas
- deve respeitar a licença do conjunto HAM10000

## 13. Conclusão

O DermaScan reúne treinamento de modelo, serviço de inferência, backend, banco de dados e frontend em uma aplicação integrada.

Os resultados mostram desempenho superior ao baseline de classe mais frequente. Entretanto, as limitações do modelo reforçam que o sistema deve ser utilizado apenas como apoio informativo e demonstração da solução desenvolvida.

### Próximos passos

- comparar o modelo com outras arquiteturas
- ampliar a avaliação com outro conjunto de dados
- melhorar o desempenho nas classes menos representadas
- adicionar recursos de explicabilidade
- aprimorar os testes automatizados
- melhorar a documentação de instalação e uso

## 14. Referências

- HAM10000: <https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000>
- Notebook: `ml-service/notebook/Classificacao_lesao.ipynb`
- Frontend: `frontend/README.md`
- Backend: `backend/README.md`
- Serviço de inteligência artificial: `ml-service/README.md`
