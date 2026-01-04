import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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

const categories = {
  expense: [
    { name: "Alimentação", icon: "🍔" },
    { name: "Transporte", icon: "🚗" },
    { name: "Moradia", icon: "🏠" },
    { name: "Saúde", icon: "⚕️" },
    { name: "Lazer", icon: "🎮" },
    { name: "Educação", icon: "📚" },
    { name: "Vestuário", icon: "👕" },
    { name: "Contas", icon: "📄" },
    { name: "Outros", icon: "📦" },
  ],
  income: [
    { name: "Salário", icon: "💰" },
    { name: "Freelance", icon: "💼" },
    { name: "Investimentos", icon: "📈" },
    { name: "Presente", icon: "🎁" },
    { name: "Venda", icon: "🏷️" },
    { name: "Outros", icon: "💵" },
  ],
};

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    try {
      const stored = await AsyncStorage.getItem("transactions");
      if (stored) {
        const transactions: Transaction[] = JSON.parse(stored);
        const found = transactions.find((t) => t.id === id);

        if (found) {
          setTransaction(found);
          setType(found.type);
          setAmount(found.amount.toFixed(2).replace(".", ","));
          setSelectedCategory(found.category);
          setDescription(found.description);
          setIsRecurring(found.isRecurring || false);
        } else {
          Alert.alert("Erro", "Transação não encontrada");
          router.back();
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a transação");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
  };

  const handleUpdate = async () => {
    if (!selectedCategory || !amount || parseCurrency(amount) === 0) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);
    try {
      const stored = await AsyncStorage.getItem("transactions");
      let transactions: Transaction[] = stored ? JSON.parse(stored) : [];

      // Atualiza a transação
      transactions = transactions.map((t) =>
        t.id === id
          ? {
              ...t,
              type,
              amount: parseCurrency(amount),
              category: selectedCategory,
              description,
              isRecurring,
            }
          : t
      );

      await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
      Alert.alert("Sucesso", "Transação atualizada!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a transação");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem("transactions");
              if (stored) {
                const transactions: Transaction[] = JSON.parse(stored);
                const filtered = transactions.filter((t) => t.id !== id);
                await AsyncStorage.setItem(
                  "transactions",
                  JSON.stringify(filtered)
                );
                router.back();
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a transação");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  const currentCategories = categories[type];

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
        <Text style={styles.headerTitle}>Editar Transação</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
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
              setSelectedCategory("");
            }}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "expense" && styles.typeButtonTextActive,
              ]}
            >
              💸 Despesa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.typeButtonActive,
            ]}
            onPress={() => {
              setType("income");
              setSelectedCategory("");
            }}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === "income" && styles.typeButtonTextActive,
              ]}
            >
              💰 Receita
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor *</Text>
          <View style={styles.currencyInputWrapper}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={(text) => setAmount(formatCurrency(text))}
              keyboardType="numeric"
              placeholder="0,00"
              placeholderTextColor={Theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.categoryGrid}>
            {currentCategories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryCard,
                  selectedCategory === cat.name && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategory === cat.name && styles.categoryNameActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione uma nota..."
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Recurring */}
        {type === "expense" && (
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.label}>Despesa Recorrente</Text>
                <Text style={styles.switchDescription}>
                  Essa despesa se repete mensalmente
                </Text>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{
                  false: Theme.colors.border,
                  true: Theme.colors.primary,
                }}
                thumbColor={isRecurring ? Theme.colors.primaryDark : "#f4f3f4"}
              />
            </View>
          </View>
        )}

        {/* Transaction Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            📅 Criada em:{" "}
            {new Date(transaction?.date || "").toLocaleDateString("pt-BR")}
          </Text>
          <Text style={styles.infoText}>🆔 ID: {id}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleUpdate}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Theme.colors.textPrimary} />
            ) : (
              <Text style={styles.saveButtonText}>💾 Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: 60,
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
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    fontSize: 24,
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
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  typeButtonActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  typeButtonText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    fontWeight: "600",
  },
  currencyInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  currencyPrefix: {
    fontSize: Theme.fontSize.xl,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.xl,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    paddingVertical: Theme.spacing.md,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.sm,
  },
  categoryCard: {
    width: "31%",
    aspectRatio: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.sm,
  },
  categoryCardActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: Theme.spacing.xs,
  },
  categoryName: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
  categoryNameActive: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  switchDescription: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  infoText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cancelButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
  },
  saveButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
});
