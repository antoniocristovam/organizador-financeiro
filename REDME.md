# 📱 Documentação de Produto (PRD) - App de Finanças Pessoais

**Versão:** 1.0
**Data:** 04/01/2026
**Plataforma:** React Native (Android & iOS)
**Responsável Backend:** [Seu Nome]

---

## 1. Visão Geral do Produto

Aplicativo de gestão financeira pessoal com foco em **alta usabilidade** e **design visual premium (Dark Mode)**. O objetivo é reduzir o atrito na inserção de despesas e fornecer clareza imediata sobre a saúde financeira do usuário (Salário vs. Gastos vs. Renda Extra).

### Principais Pilares

1.  **Agilidade:** Inserção de dados em menos de 3 toques.
2.  **Previsibilidade:** Clareza sobre quanto sobra do salário no momento que o dinheiro cai.
3.  **Estética:** Interface moderna, minimalista e elegante.

---

## 2. Fluxo de Usuário (User Flow)

### 2.1. Onboarding (Primeiro Acesso)

_O momento crucial para capturar os dados base para os cálculos._

1.  **Login/Cadastro:** Autenticação via Google/Apple ou E-mail.
2.  **Setup Financeiro (Wizard):**
    - **Passo 1:** Pergunta: "Qual seu salário/renda principal líquida mensal?" (Input Numérico).
    - **Passo 2:** Pergunta: "Possui Renda Extra recorrente?" (Switch Sim/Não).
    - **Passo 3 (Se Sim):** "Qual a estimativa média dessa renda extra?"
3.  **Home:** O usuário cai no Dashboard já com o saldo projetado (Salário + Extra).

---

## 3. Requisitos Funcionais

### 🏠 Módulo: Dashboard (Home)

| ID        | Funcionalidade            | Descrição                                                                          |
| :-------- | :------------------------ | :--------------------------------------------------------------------------------- |
| **RF-01** | **Visualização de Saldo** | Exibir saldo atual e projetado. Deve ter função de ocultar valores (ícone "olho"). |
| **RF-02** | **Barra de Orçamento**    | Componente visual (Barra ou Rosca) indicando % da renda já comprometida.           |
| **RF-03** | **Resumo Rápido**         | Cards mostrando total de "Entradas" vs "Saídas" no mês corrente.                   |
| **RF-04** | **Feed Recente**          | Listagem das últimas 3 a 5 transações para conferência rápida.                     |

### 💰 Módulo: Gestão de Transações

| ID        | Funcionalidade         | Descrição                                                                                       |
| :-------- | :--------------------- | :---------------------------------------------------------------------------------------------- |
| **RF-05** | **Adicionar Despesa**  | Input de valor, seleção de categoria, data e descrição opcional.                                |
| **RF-06** | **Adicionar Receita**  | Input de valor (Salário, Freelance, Venda) e data.                                              |
| **RF-07** | **Recorrência (Fixo)** | Checkbox "É uma despesa fixa?" (ex: Aluguel, Netflix). O sistema deve repetir isso mensalmente. |
| **RF-08** | **Categorização**      | Seleção visual por ícones (Mercado, Lazer, Transporte, Saúde, Casa).                            |

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
