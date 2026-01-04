import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Theme } from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import { useFadeIn, useSlideIn } from "@/hooks/useAnimations";

interface FinancialData {
  salary: number;
  hasExtraIncome: boolean;
  extraIncome: number;
  onboardingComplete: boolean;
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function DashboardScreen() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadFinancialData();
    loadTransactions();
  }, []);

  const loadFinancialData = async () => {
    try {
      const data = await AsyncStorage.getItem("userFinancialData");
      if (data) {
        setFinancialData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFinancialData();
    await loadTransactions();
    setRefreshing(false);
  };

  const calculateTotals = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome =
      (financialData?.salary || 0) + (financialData?.extraIncome || 0) + income;
    const balance = totalIncome - expenses;

    return { totalIncome, expenses, balance };
  };

  const getCategoryData = () => {
    const categories: { [key: string]: number } = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    const colors = ["#8B5CF6", "#F75A68", "#04D361", "#F59E0B", "#3B82F6"];

    return Object.entries(categories).map(([name, amount], index) => ({
      name,
      amount,
      color: colors[index % colors.length],
      legendFontColor: Theme.colors.textSecondary,
      legendFontSize: 12,
    }));
  };

  const { totalIncome, expenses, balance } = calculateTotals();
  const budgetUsed = totalIncome > 0 ? expenses / totalIncome : 0;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const categoryData = getCategoryData();
  const screenWidth = Dimensions.get("window").width;

  // Animations
  const fadeIn = useFadeIn(600);
  const slideUp = useSlideIn("up", 600, 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeIn }]}>
        <View>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.subtitle}>Confira suas finanças</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Saldo Card */}
      <Animated.View
        style={[styles.balanceCard, { opacity: fadeIn, transform: [slideUp] }]}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Text style={styles.eyeIcon}>{showBalance ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>
          {showBalance ? formatCurrency(balance) : "R$ ••••••"}
        </Text>
        <View style={styles.balanceFooter}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemLabel}>💰 Receita</Text>
            <Text
              style={[styles.balanceItemValue, { color: Theme.colors.success }]}
            >
              {showBalance ? formatCurrency(totalIncome) : "••••"}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemLabel}>💸 Despesas</Text>
            <Text
              style={[styles.balanceItemValue, { color: Theme.colors.danger }]}
            >
              {showBalance ? formatCurrency(expenses) : "••••"}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Budget Progress */}
      <Animated.View style={[styles.section, { opacity: fadeIn }]}>
        <Text style={styles.sectionTitle}>📊 Uso do Orçamento</Text>
        <View style={styles.card}>
          <ProgressChart
            data={{
              labels: ["Gasto"],
              data: [budgetUsed],
            }}
            width={screenWidth - 64}
            height={180}
            strokeWidth={16}
            radius={60}
            chartConfig={{
              backgroundGradientFrom: Theme.colors.surface,
              backgroundGradientTo: Theme.colors.surface,
              color: (opacity = 1) => {
                const percentage = budgetUsed * 100;
                if (percentage > 90) return `rgba(247, 90, 104, ${opacity})`;
                if (percentage > 70) return `rgba(245, 158, 11, ${opacity})`;
                return `rgba(139, 92, 246, ${opacity})`;
              },
              labelColor: () => Theme.colors.textPrimary,
            }}
            hideLegend
          />
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {(budgetUsed * 100).toFixed(1)}% do orçamento utilizado
            </Text>
            <Text style={styles.progressValue}>
              {formatCurrency(expenses)} de {formatCurrency(totalIncome)}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Category Chart */}
      {categoryData.length > 0 && (
        <Animated.View style={[styles.section, { opacity: fadeIn }]}>
          <Text style={styles.sectionTitle}>🏷️ Gastos por Categoria</Text>
          <View style={styles.card}>
            <PieChart
              data={categoryData}
              width={screenWidth - 64}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Animated.View>
      )}

      {/* Recent Transactions */}
      <Animated.View style={[styles.section, { opacity: fadeIn }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📝 Transações Recentes</Text>
          <TouchableOpacity onPress={() => router.push("/transactions/list")}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {transactions.slice(0, 5).map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
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
              <View>
                <Text style={styles.transactionCategory}>
                  {transaction.category}
                </Text>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
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
                })}
              </Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View style={[styles.section, { opacity: fadeIn }]}>
        <Text style={styles.sectionTitle}>⚡ Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/transactions/add")}
          >
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>Adicionar{"\n"}Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/transactions/add")}
          >
            <Text style={styles.quickActionIcon}>💰</Text>
            <Text style={styles.quickActionText}>Adicionar{"\n"}Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/transactions/list")}
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Ver{"\n"}Transações</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  settingsIcon: {
    fontSize: 24,
  },
  greeting: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: Theme.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  eyeIcon: {
    fontSize: 20,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemLabel: {
    fontSize: Theme.fontSize.xs,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  balanceItemValue: {
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  seeAll: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  progressInfo: {
    alignItems: "center",
    marginTop: Theme.spacing.md,
  },
  progressLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
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
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  quickActionText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
});
