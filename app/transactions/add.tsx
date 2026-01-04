import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Theme } from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TransactionType = "expense" | "income";

interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

const EXPENSE_CATEGORIES: Category[] = [
  { id: "1", name: "Mercado", icon: "🛒", type: "expense" },
  { id: "2", name: "Transporte", icon: "🚗", type: "expense" },
  { id: "3", name: "Alimentação", icon: "🍔", type: "expense" },
  { id: "4", name: "Lazer", icon: "🎮", type: "expense" },
  { id: "5", name: "Saúde", icon: "💊", type: "expense" },
  { id: "6", name: "Casa", icon: "🏠", type: "expense" },
  { id: "7", name: "Educação", icon: "📚", type: "expense" },
  { id: "8", name: "Vestuário", icon: "👕", type: "expense" },
  { id: "9", name: "Outros", icon: "📦", type: "expense" },
];

const INCOME_CATEGORIES: Category[] = [
  { id: "10", name: "Salário", icon: "💰", type: "income" },
  { id: "11", name: "Freelance", icon: "💻", type: "income" },
  { id: "12", name: "Investimentos", icon: "📈", type: "income" },
  { id: "13", name: "Vendas", icon: "💵", type: "income" },
  { id: "14", name: "Presentes", icon: "🎁", type: "income" },
  { id: "15", name: "Outros", icon: "💸", type: "income" },
];

export default function AddTransactionScreen() {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatCurrency(text));
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
  };

  const handleSave = async () => {
    if (!amount || parseCurrency(amount) === 0) {
      Alert.alert("Erro", "Por favor, informe o valor");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Erro", "Por favor, selecione uma categoria");
      return;
    }

    try {
      const transaction = {
        id: Date.now().toString(),
        type,
        amount: parseCurrency(amount),
        category: selectedCategory.name,
        description: description || selectedCategory.name,
        date,
        isRecurring,
        createdAt: new Date().toISOString(),
      };

      // Carregar transações existentes
      const existingData = await AsyncStorage.getItem("transactions");
      const transactions = existingData ? JSON.parse(existingData) : [];

      // Adicionar nova transação
      transactions.unshift(transaction);

      // Salvar
      await AsyncStorage.setItem("transactions", JSON.stringify(transactions));

      Alert.alert(
        "Sucesso! 🎉",
        `${type === "expense" ? "Despesa" : "Receita"} adicionada com sucesso`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a transação");
    }
  };

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
        <Text style={styles.headerTitle}>Nova Transação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && styles.typeButtonActive,
            ]}
            onPress={() => {
              setType("expense");
              setSelectedCategory(null);
            }}
          >
            <Text style={styles.typeEmoji}>📉</Text>
            <Text
              style={[
                styles.typeText,
                type === "expense" && styles.typeTextActive,
              ]}
            >
              Despesa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.typeButtonActive,
            ]}
            onPress={() => {
              setType("income");
              setSelectedCategory(null);
            }}
          >
            <Text style={styles.typeEmoji}>📈</Text>
            <Text
              style={[
                styles.typeText,
                type === "income" && styles.typeTextActive,
              ]}
            >
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💵 Valor</Text>
          <View style={styles.amountWrapper}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0,00"
              placeholderTextColor={Theme.colors.textSecondary}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Categoria</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory?.id === category.id &&
                    styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Descrição (opcional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Ex: Compras do mês, conta de luz..."
            placeholderTextColor={Theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Recurring */}
        {type === "expense" && (
          <TouchableOpacity
            style={styles.recurringOption}
            onPress={() => setIsRecurring(!isRecurring)}
          >
            <View style={styles.checkboxContainer}>
              <View
                style={[styles.checkbox, isRecurring && styles.checkboxActive]}
              >
                {isRecurring && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View>
                <Text style={styles.recurringLabel}>Despesa fixa</Text>
                <Text style={styles.recurringDescription}>
                  Repetir automaticamente todo mês
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Transação</Text>
        </TouchableOpacity>
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
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  typeSelector: {
    flexDirection: "row",
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  typeButtonActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary + "20",
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  typeText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    fontWeight: "600",
  },
  typeTextActive: {
    color: Theme.colors.primary,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.lg,
  },
  currencyPrefix: {
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    marginRight: Theme.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    paddingVertical: Theme.spacing.lg,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.md,
  },
  categoryItem: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Theme.colors.border,
  },
  categoryItemActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary + "20",
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Theme.spacing.sm,
  },
  categoryName: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  descriptionInput: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    minHeight: 80,
    textAlignVertical: "top",
  },
  recurringOption: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    marginRight: Theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  checkmark: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  recurringLabel: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
  },
  recurringDescription: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    marginTop: Theme.spacing.lg,
  },
  saveButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
});
