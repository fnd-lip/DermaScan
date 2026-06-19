# PRD - DermaScan

## 1. Visão geral

O DermaScan é uma aplicação web para classificação assistida de lesões dermatológicas. O usuário acessa o sistema, seleciona ou envia uma imagem de lesão e recebe um resultado com classe prevista, confiança, nível de atenção e probabilidades.

O sistema também permite consultar o histórico de análises realizadas pelo usuário.

Este documento descreve apenas os requisitos principais existentes no momento. Novos requisitos poderão ser adicionados conforme o desenvolvimento avançar.

## 2. Objetivo

Permitir que o usuário execute um fluxo simples de análise dermatológica:

1. Entrar no sistema.
2. Selecionar uma imagem ou amostra disponível.
3. Confirmar a análise.
4. Visualizar o resultado.
5. Consultar o histórico.

## 3. Funcionalidades principais

### 3.1 Cadastro e login

O sistema deve permitir que o usuário crie uma conta e entre na aplicação.

Comportamento esperado:

- O usuário informa nome, e-mail e senha no cadastro.
- O usuário informa e-mail e senha no login.
- Quando o login é realizado com sucesso, o usuário acessa a área principal do sistema.
- Quando o login falha, o sistema exibe uma mensagem de erro.

Observação:

- Neste momento, o PRD não define regras específicas de validação de e-mail ou tamanho de senha.

### 3.2 Aviso médico

O sistema deve apresentar um aviso informando que o resultado é apenas uma estimativa e não substitui avaliação médica.

Comportamento esperado:

- O usuário deve visualizar o aviso antes de usar o sistema.
- O usuário deve conseguir aceitar o aviso e continuar.

### 3.3 Tela inicial e navegação

O sistema deve apresentar uma área principal após o login.

Comportamento esperado:

- O usuário deve conseguir navegar pelas principais áreas disponíveis.
- As áreas principais incluem análise, histórico e perfil.

### 3.4 Análise de lesão

O sistema deve permitir iniciar uma análise dermatológica.

Comportamento esperado:

- O usuário seleciona uma imagem, captura uma foto ou escolhe uma amostra disponível.
- O sistema mostra a imagem antes de processar.
- O usuário confirma a análise.
- O sistema processa a solicitação.
- O sistema exibe o resultado.

### 3.5 Resultado da análise

O sistema deve exibir o resultado da classificação.

Informações esperadas:

- Classe prevista.
- Confiança.
- Nível de atenção.
- Lista de probabilidades.
- Imagem analisada, quando disponível.

### 3.6 Histórico

O sistema deve permitir consultar análises já realizadas.

Comportamento esperado:

- O usuário consegue abrir a tela de histórico.
- O sistema lista análises salvas.
- O usuário consegue visualizar detalhes de uma análise.
- O usuário consegue excluir uma análise.
- O usuário consegue limpar o histórico, se essa opção estiver disponível.

## 4. Fluxos principais para teste

### Fluxo 1 - Login

1. Abrir a aplicação.
2. Informar e-mail e senha.
3. Entrar no sistema.
4. Verificar se a área principal é exibida.

### Fluxo 2 - Cadastro

1. Abrir a tela de cadastro.
2. Informar nome, e-mail e senha.
3. Criar a conta.
4. Verificar se o usuário consegue seguir para o sistema.

### Fluxo 3 - Aceitar aviso médico

1. Entrar no sistema.
2. Visualizar o aviso médico.
3. Aceitar o aviso.
4. Verificar se o dashboard é exibido.

### Fluxo 4 - Fazer análise com amostra

1. Acessar a área de análise.
2. Selecionar uma amostra disponível.
3. Conferir a imagem.
4. Confirmar a análise.
5. Verificar se o resultado aparece.

### Fluxo 5 - Consultar histórico

1. Fazer uma análise.
2. Acessar o histórico.
3. Verificar se a análise aparece na lista.
4. Abrir a análise salva.

### Fluxo 6 - Excluir item do histórico

1. Acessar o histórico.
2. Selecionar uma análise existente.
3. Excluir a análise.
4. Verificar se ela saiu da lista.

## 5. Dados para teste

Conta sugerida para testes:

- Nome: Usuário Teste
- E-mail: teste@dermascan.com
- Senha: 1234

URLs locais esperadas:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## 6. Observações

- Este PRD é uma versão inicial
- O documento deve ser atualizado conforme novas funcionalidades forem implementadas.
- Não devem ser testadas regras que ainda não existem no sistema.
- O foco inicial é validar o fluxo principal da aplicação.
