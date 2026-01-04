import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Theme } from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  isRecurring?: boolean;
}

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "7days" | "30days" | "90days"
  >("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem("transactions");
      if (data) {
        setTransactions(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = transactions.filter((t) => t.id !== id);
              await AsyncStorage.setItem(
                "transactions",
                JSON.stringify(updated)
              );
              setTransactions(updated);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a transação");
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getDateFilteredTransactions = () => {
    if (dateFilter === "all") return transactions;

    const now = new Date();
    const days = dateFilter === "7days" ? 7 : dateFilter === "30days" ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return transactions.filter((t) => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = getDateFilteredTransactions().filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const getTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  const { income, expenses, balance } = getTotals();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transações</Text>
        <TouchableOpacity onPress={() => router.push("/transactions/add")}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Receitas</Text>
          <Text style={[styles.summaryValue, { color: Theme.colors.success }]}>
            {formatCurrency(income)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Despesas</Text>
          <Text style={[styles.summaryValue, { color: Theme.colors.danger }]}>
            {formatCurrency(expenses)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  balance >= 0 ? Theme.colors.success : Theme.colors.danger,
              },
            ]}
          >
            {formatCurrency(balance)}
          </Text>
        </View>
      </View>

      {/* Type Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "income" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("income")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "income" && styles.filterTextActive,
            ]}
          >
            Receitas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "expense" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("expense")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "expense" && styles.filterTextActive,
            ]}
          >
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Filter */}
      <View style={styles.dateFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              dateFilter === "all" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setDateFilter("all")}
          >
            <Text
              style={[
                styles.dateFilterText,
                dateFilter === "all" && styles.dateFilterTextActive,
              ]}
            >
              📅 Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              dateFilter === "7days" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setDateFilter("7days")}
          >
            <Text
              style={[
                styles.dateFilterText,
                dateFilter === "7days" && styles.dateFilterTextActive,
              ]}
            >
              📅 7 dias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              dateFilter === "30days" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setDateFilter("30days")}
          >
            <Text
              style={[
                styles.dateFilterText,
                dateFilter === "30days" && styles.dateFilterTextActive,
              ]}
            >
              📅 30 dias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              dateFilter === "90days" && styles.dateFilterButtonActive,
            ]}
            onPress={() => setDateFilter("90days")}
          >
            <Text
              style={[
                styles.dateFilterText,
                dateFilter === "90days" && styles.dateFilterTextActive,
              ]}
            >
              📅 90 dias
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Transaction List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/transactions/add")}
            >
              <Text style={styles.emptyButtonText}>Adicionar Transação</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionWrapper}>
              <TouchableOpacity
                style={styles.transactionItem}
                onPress={() =>
                  router.push(`/transactions/edit/${transaction.id}`)
                }
                onLongPress={() => deleteTransaction(transaction.id)}
              >
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor:
                          transaction.type === "income"
                            ? Theme.colors.success + "20"
                            : Theme.colors.danger + "20",
                      },
                    ]}
                  >
                    <Text style={styles.transactionEmoji}>
                      {transaction.type === "income" ? "📈" : "📉"}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    {transaction.isRecurring && (
                      <View style={styles.recurringBadge}>
                        <Text style={styles.recurringText}>🔁 Recorrente</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === "income"
                            ? Theme.colors.success
                            : Theme.colors.danger,
                      },
                    ]}
                  >
                    {transaction.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: Theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 28,
    color: Theme.colors.textPrimary,
  },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
  },
  addIcon: {
    fontSize: 32,
    color: Theme.colors.primary,
    fontWeight: "bold",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.lg,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  filterText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: "600",
  },
  filterTextActive: {
    color: Theme.colors.textPrimary,
  },
  dateFilterContainer: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  dateFilterButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  dateFilterButtonActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dateFilterText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: "600",
  },
  dateFilterTextActive: {
    color: Theme.colors.textPrimary,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  transactionWrapper: {
    marginBottom: Theme.spacing.sm,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Theme.spacing.md,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
  },
  transactionDescription: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  recurringBadge: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  recurringText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
  transactionDate: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Theme.spacing.lg,
  },
  emptyText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  emptyButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  emptyButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
});
