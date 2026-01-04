# � Finanças Pro - App de Gestão Financeira Pessoal

**Versão:** 1.3.0
**Data:** 04/01/2026
**Plataforma:** React Native (Expo) - Android & iOS
**Status:** ✅ Em Produção

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Instalação](#instalação)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Tecnologias](#tecnologias)
6. [Changelog](#changelog)

---

## 🎯 Visão Geral

Aplicativo de gestão financeira pessoal com foco em **alta usabilidade** e **design visual premium (Dark Mode)**. O objetivo é reduzir o atrito na inserção de despesas e fornecer clareza imediata sobre a saúde financeira do usuário.

### Principais Pilares

1. **Agilidade:** Inserção de dados em menos de 3 toques
2. **Previsibilidade:** Clareza sobre saldo e gastos mensais
3. **Estética:** Interface moderna, minimalista e elegante (Cyberpunk Dark)

---

## ✨ Funcionalidades

### 🔐 Autenticação

- ✅ **Login/Registro** - Autenticação com e-mail e senha
- ✅ **Botões de Social Auth** - Interface preparada para Google/Apple (UI only)
- ✅ **Auto-login** - Sistema de persistência que detecta usuário logado
- ✅ **Logout Seguro** - Função de sair da conta com confirmação

### 🚀 Onboarding

- ✅ **Wizard de 3 Etapas**
  1. Definição do salário mensal
  2. Configuração de renda extra (opcional)
  3. Resumo e confirmação
- ✅ **Skip Automático** - Usuários que já completaram o onboarding vão direto ao dashboard

### 🏠 Dashboard

- ✅ **Cartão de Saldo** - Exibe saldo atual com opção de ocultar valores (👁️)
- ✅ **Resumo Financeiro** - Cards de Receita, Despesas e Saldo
- ✅ **Gráfico de Pizza** - Distribuição de gastos por categoria
- ✅ **Barra de Progresso** - % do orçamento comprometido
- ✅ **Feed de Transações** - Últimas 5 transações recentes
- ✅ **Ações Rápidas** - Botões para adicionar receita/despesa e ver todas as transações
- ✅ **Pull to Refresh** - Atualização de dados ao arrastar para baixo
- ✅ **Botão de Configurações** - Acesso rápido às configurações

### 💸 Gestão de Transações

- ✅ **Adicionar Transação**
  - Escolha entre Receita ou Despesa
  - 15 categorias pré-definidas (9 despesas + 6 receitas)
  - Input de valor com formatação automática (R$ XX.XXX,XX)
  - Campo de descrição opcional
  - Marcação de despesa recorrente
- ✅ **Editar Transação** **(NOVO!)**
  - Modificar todos os campos de uma transação existente
  - Visualizar data de criação e ID
  - Botão de exclusão integrado
- ✅ **Listar Transações**
  - Filtros: Todas / Receitas / Despesas
  - Cards resumo com totais
  - Toque para editar
  - Pressionar e segurar para excluir
  - Indicador visual de transações recorrentes

### 📊 Relatórios

- ✅ **Filtros de Período**
  - Mês atual
  - Mês anterior
  - Últimos 3 meses
  - Últimos 6 meses
  - Último ano
- ✅ **Gráfico de Barras** - Receitas vs Despesas por mês
- ✅ **Gráfico de Linha** - Evolução do saldo ao longo do tempo
- ✅ **Gráfico de Pizza** - Distribuição por categoria
- ✅ **Insights Inteligentes** - Análise automática do comportamento financeiro
- ✅ **Cards de Métricas** - Receita total, despesas totais e saldo do período

### ⚙️ Configurações **(NOVO!)**

- ✅ **Visualização de Conta** - Exibe e-mail do usuário
- ✅ **Edição de Dados Financeiros**
  - Modificar salário mensal
  - Ativar/desativar renda extra
  - Alterar valor da renda extra
  - Cálculo automático da renda total
- ✅ **Zona de Perigo**
  - Logout com confirmação
  - Limpar todos os dados (reset completo)
- ✅ **Informações do App** - Versão e descrição

---

## 📦 Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (app móvel) ou emulador Android/iOS

### Passos

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd organizador-financeiro
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

3. **Inicie o projeto:**

```bash
npx expo start
```

4. **Execute no dispositivo:**
   - Escaneie o QR code com o app Expo Go (Android/iOS)
   - Pressione `a` para abrir no emulador Android
   - Pressione `i` para abrir no simulador iOS

---

## 📁 Estrutura do Projeto

```
organizador-financeiro/
├── app/
│   ├── (tabs)/               # Navegação principal (tabs)
│   │   ├── index.tsx         # Dashboard
│   │   ├── two.tsx           # Relatórios
│   │   └── _layout.tsx       # Layout das tabs
│   ├── auth/
│   │   └── login.tsx         # Tela de login/registro
│   ├── onboarding/
│   │   └── index.tsx         # Wizard de onboarding
│   ├── transactions/
│   │   ├── add.tsx           # Adicionar transação
│   │   ├── list.tsx          # Listar transações
│   │   └── edit/
│   │       └── [id].tsx      # Editar transação (dinâmico)
│   ├── settings/
│   │   └── index.tsx         # Configurações do usuário
│   ├── index.tsx             # Root com verificação de auth
│   ├── _layout.tsx           # Layout raiz
│   ├── +html.tsx             # HTML customizado
│   ├── +not-found.tsx        # Página 404
│   └── modal.tsx             # Modal genérico
├── constants/
│   ├── Theme.ts              # Design system (cores, espaçamentos)
│   └── Colors.ts             # Paleta de cores original
├── assets/
│   ├── fonts/                # Fontes personalizadas
│   └── images/               # Imagens e ícones
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

---

## 🛠️ Tecnologias

### Core

- **React Native** - Framework mobile
- **Expo Router** - Navegação file-based
- **TypeScript** - Tipagem estática

### Armazenamento

- **@react-native-async-storage/async-storage** - Persistência local

### Visualização de Dados

- **react-native-chart-kit** - Gráficos (Pie, Bar, Line, Progress)
- **react-native-svg** - Renderização de SVG (dep. dos gráficos)

### UI/UX

- **Expo Status Bar** - Controle da barra de status
- **React Native Components** - ScrollView, TouchableOpacity, etc.
- **Animated API** - Animações nativas do React Native
- **Custom Hooks** - Hooks de animação reutilizáveis (fade, slide, scale)

### Design System

- **Tema Customizado** - Cyberpunk Minimalista Dark
  - Background: `#09090A`
  - Primary: `#8B5CF6` (Roxo vibrante)
  - Success: `#04D361` (Verde neon)
  - Danger: `#F75A68` (Vermelho)
  - Warning: `#F59E0B` (Laranja)

---

## 📝 Changelog

### v1.3.0 - Performance e UX (04/01/2026)

**🎨 Animações:**

- ✅ Sistema completo de animações com custom hooks
- ✅ Fade in e slide up no dashboard
- ✅ Animações de entrada no login (fade + scale)
- ✅ Transições suaves entre componentes
- ✅ Loading states com ActivityIndicator em todas as operações

**⏱️ Loading States:**

- ✅ Indicador visual durante login/registro
- ✅ Loading ao salvar transações
- ✅ Loading ao editar transações
- ✅ Loading ao salvar configurações
- ✅ Desabilitação de botões durante operações assíncronas

**📅 Filtros de Data:**

- ✅ Filtro por período na lista de transações
- ✅ Opções: Todas / 7 dias / 30 dias / 90 dias
- ✅ Interface com scroll horizontal
- ✅ Filtro combinado com tipo de transação

**🔧 Melhorias Técnicas:**

- Hooks reutilizáveis para animações
- Código mais organizado e modular
- Performance otimizada com useNativeDriver

---

### v1.2.0 - Melhorias e Refinamentos (04/01/2026)

**🆕 Novas Funcionalidades:**

- ✅ Auto-login: Sistema de verificação automática na inicialização
- ✅ Tela de Configurações completa
- ✅ Edição de transações existentes
- ✅ Edição de dados financeiros (salário e renda extra)
- ✅ Botão de configurações no dashboard
- ✅ Logout com confirmação
- ✅ Reset completo de dados

**🔧 Melhorias:**

- Interface de transações agora permite edição ao tocar
- Mantida a exclusão por pressionar e segurar
- Visualização de ID e data de criação nas transações
- Cálculo dinâmico da renda total nas configurações
- Confirmações de segurança para ações destrutivas

**📱 Interface:**

- Novos estilos para botões de ação
- Cards informativos com bordas coloridas
- Badges de indicação de transação recorrente
- Loading states com ActivityIndicator

---

### v1.0.0 - Lançamento Inicial

**✨ Funcionalidades Principais:**

- Autenticação e registro de usuários
- Onboarding com wizard de 3 etapas
- Dashboard com visualizações financeiras
- Gestão completa de transações
- Relatórios com múltiplos gráficos
- Sistema de categorias
- Persistência local com AsyncStorage
- Tema dark cyberpunk

---

## 🎨 Design System

### Paleta de Cores

```typescript
colors: {
  background: '#09090A',      // Fundo principal
  surface: '#18181B',         // Cards e superfícies
  border: '#27272A',          // Bordas
  primary: '#8B5CF6',         // Roxo vibrante
  primaryDark: '#7C3AED',     // Roxo escuro
  success: '#04D361',         // Verde neon
  danger: '#F75A68',          // Vermelho
  warning: '#F59E0B',         // Laranja
  info: '#3B82F6',            // Azul
  textPrimary: '#FAFAFA',     // Texto principal
  textSecondary: '#A1A1AA',   // Texto secundário
}
```

### Espaçamentos

```typescript
spacing: {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}
```

### Bordas

```typescript
borderRadius: {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
}
```

---

## 🚀 Roadmap Futuro

### Funcionalidades Concluídas ✅

- ✅ Animações de transição entre telas
- ✅ Loading states visuais em todas as ações assíncronas
- ✅ Filtros de data na listagem de transações

### Funcionalidades Planejadas

- [ ] Busca de transações por descrição/categoria
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Notificações push para lembretes de despesas
- [ ] Metas financeiras e acompanhamento
- [ ] Backup e sincronização na nuvem
- [ ] Autenticação real com Firebase/Supabase
- [ ] Multi-moeda
- [ ] Anexos de comprovantes (fotos)
- [ ] Compartilhamento de relatórios

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto é privado e confidencial.

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato.

---

**Desenvolvido com ❤️ usando React Native + Expo**
| :-------- | :--------------------- | :---------------------------------------------------------------------------------------------- |
| **RF-05** | **Adicionar Despesa** | Input de valor, seleção de categoria, data e descrição opcional. |
| **RF-06** | **Adicionar Receita** | Input de valor (Salário, Freelance, Venda) e data. |
| **RF-07** | **Recorrência (Fixo)** | Checkbox "É uma despesa fixa?" (ex: Aluguel, Netflix). O sistema deve repetir isso mensalmente. |
| **RF-08** | **Categorização** | Seleção visual por ícones (Mercado, Lazer, Transporte, Saúde, Casa). |

### 📊 Módulo: Relatórios

| ID        | Funcionalidade            | Descrição                                                     |
| :-------- | :------------------------ | :------------------------------------------------------------ |
| **RF-09** | **Gráfico de Categorias** | Gráfico de rosca (Donut) mostrando onde o dinheiro está indo. |
| **RF-10** | **Filtro Temporal**       | Capacidade de navegar entre meses (Mês Atual, Mês Passado).   |

---

## 4. Design System (Guia Visual)

O estilo visual deve seguir a tendência "Cyberpunk Minimalista" ou "Glassmorphism Dark".

### Paleta de Cores

- **Background:** `#09090A` (Preto Fosco Profundo)
- **Cards/Surface:** `#1C1C1E` (Cinza Chumbo)
- **Primary (Ação):** `#8B5CF6` (Violeta Neon) ou `#6366F1` (Indigo)
- **Text Primary:** `#FFFFFF` (Branco Puro)
- **Text Secondary:** `#A1A1AA` (Cinza Médio - para legendas)
- **Success (Entrada):** `#04D361` (Verde Menta)
- **Danger (Saída):** `#F75A68` (Verm
