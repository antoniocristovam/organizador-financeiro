import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Theme } from '@/constants/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface MonthData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

type FilterPeriod = 'current' | 'last' | 'last3' | 'last6' | 'year';

export default function ReportsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('current');
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await AsyncStorage.getItem('transactions');
      if (data) {
        setTransactions(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'current':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        return transactions.filter(t => {
          const date = new Date(t.date);
          return date >= startDate && date <= endDate;
        });
      case 'last3':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'last6':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const getMonthlyData = (): MonthData[] => {
    const filtered = getFilteredTransactions();
    const monthsMap: { [key: string]: MonthData } = {};

    filtered.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0,
          balance: 0,
        };
      }

      if (t.type === 'income') {
        monthsMap[monthKey].income += t.amount;
      } else {
        monthsMap[monthKey].expenses += t.amount;
      }
      monthsMap[monthKey].balance = monthsMap[monthKey].income - monthsMap[monthKey].expenses;
    });

    return Object.values(monthsMap).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getCategoryBreakdown = () => {
    const filtered = getFilteredTransactions().filter(t => t.type === 'expense');
    const categories: { [key: string]: number } = {};

    filtered.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    const colors = ['#8B5CF6', '#F75A68', '#04D361', '#F59E0B', '#3B82F6', '#EC4899', '#10B981'];
    const sorted = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);

    return sorted.map(([name, amount], index) => ({
      name,
      amount,
      color: colors[index],
      legendFontColor: Theme.colors.textSecondary,
      legendFontSize: 12,
    }));
  };

  const getTotals = () => {
    const filtered = getFilteredTransactions();
    const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryBreakdown();
  const totals = getTotals();

  const periods = [
    { key: 'current' as FilterPeriod, label: 'Mês Atual' },
    { key: 'last' as FilterPeriod, label: 'Mês Passado' },
    { key: 'last3' as FilterPeriod, label: 'Últimos 3' },
    { key: 'last6' as FilterPeriod, label: 'Últimos 6' },
    { key: 'year' as FilterPeriod, label: 'Ano' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Relatórios</Text>
        <Text style={styles.headerSubtitle}>Análise detalhada das suas finanças</Text>
      </View>

      {/* Period Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.filterButton,
              selectedPeriod === period.key && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedPeriod === period.key && styles.filterTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: Theme.colors.success + '20' }]}>
          <Text style={styles.summaryLabel}>💰 Receitas</Text>
          <Text style={[styles.summaryValue, { color: Theme.colors.success }]}>
            {formatCurrency(totals.income)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Theme.colors.danger + '20' }]}>
          <Text style={styles.summaryLabel}>💸 Despesas</Text>
          <Text style={[styles.summaryValue, { color: Theme.colors.danger }]}>
            {formatCurrency(totals.expenses)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Theme.colors.primary + '20' }]}>
          <Text style={styles.summaryLabel}>💎 Saldo</Text>
          <Text style={[styles.summaryValue, { color: totals.balance >= 0 ? Theme.colors.success : Theme.colors.danger }]}>
            {formatCurrency(totals.balance)}
          </Text>
        </View>
      </View>

      {/* Monthly Comparison */}
      {monthlyData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Evolução Mensal</Text>
          <View style={styles.card}>
            <BarChart
              data={{
                labels: monthlyData.map(m => m.month),
                datasets: [
                  {
                    data: monthlyData.map(m => m.expenses),
                    color: () => Theme.colors.danger,
                  },
                  {
                    data: monthlyData.map(m => m.income),
                    color: () => Theme.colors.success,
                  },
                ],
                legend: ['Despesas', 'Receitas'],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: Theme.colors.surface,
                backgroundGradientFrom: Theme.colors.surface,
                backgroundGradientTo: Theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: () => Theme.colors.textSecondary,
                style: {
                  borderRadius: Theme.borderRadius.md,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: Theme.colors.border,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: Theme.borderRadius.md,
              }}
            />
          </View>
        </View>
      )}

      {/* Balance Trend */}
      {monthlyData.length > 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Tendência de Saldo</Text>
          <View style={styles.card}>
            <LineChart
              data={{
                labels: monthlyData.map(m => m.month),
                datasets: [{
                  data: monthlyData.map(m => m.balance),
                }],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: Theme.colors.surface,
                backgroundGradientFrom: Theme.colors.surface,
                backgroundGradientTo: Theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                labelColor: () => Theme.colors.textSecondary,
                style: {
                  borderRadius: Theme.borderRadius.md,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: Theme.colors.primary,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: Theme.colors.border,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: Theme.borderRadius.md,
              }}
            />
          </View>
        </View>
      )}

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Despesas por Categoria</Text>
          <View style={styles.card}>
            <PieChart
              data={categoryData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <View style={styles.categoryList}>
              {categoryData.map((cat, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>{formatCurrency(cat.amount)}</Text>
                    <Text style={styles.categoryPercent}>
                      {((cat.amount / totals.expenses) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Insights</Text>
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>
            {totals.balance >= 0 ? '✅' : '⚠️'}
          </Text>
          <Text style={styles.insightText}>
            {totals.balance >= 0
              ? `Você economizou ${formatCurrency(totals.balance)} no período selecionado!`
              : `Atenção! Você gastou ${formatCurrency(Math.abs(totals.balance))} a mais do que ganhou.`}
          </Text>
        </View>
        
        {categoryData.length > 0 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>📊</Text>
            <Text style={styles.insightText}>
              Sua maior despesa foi em {categoryData[0].name} com {formatCurrency(categoryData[0].amount)}
            </Text>
          </View>
        )}

        {monthlyData.length > 1 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>
              {monthlyData[monthlyData.length - 1].balance > monthlyData[monthlyData.length - 2].balance ? '📈' : '📉'}
            </Text>
            <Text style={styles.insightText}>
              {monthlyData[monthlyData.length - 1].balance > monthlyData[monthlyData.length - 2].balance
                ? 'Seu saldo está melhorando! Continue assim.'
                : 'Seu saldo diminuiu em relação ao mês anterior. Revise seus gastos.'}
            </Text>
          </View>
        )}
      </View>
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
    marginBottom: Theme.spacing.lg,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  filterScroll: {
    marginBottom: Theme.spacing.lg,
  },
  filterContainer: {
    gap: Theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
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
    fontWeight: '600',
  },
  filterTextActive: {
    color: Theme.colors.textPrimary,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xl,
  },
  summaryCard: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: Theme.fontSize.md,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  categoryList: {
    marginTop: Theme.spacing.lg,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Theme.spacing.sm,
  },
  categoryName: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  categoryPercent: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: Theme.spacing.md,
  },
  insightText: {
    flex: 1,
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textPrimary,
    lineHeight: 20,
  },
});
