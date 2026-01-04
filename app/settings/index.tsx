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
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Theme } from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserData {
  email: string;
  authenticated: boolean;
  onboardingComplete: boolean;
}

interface FinancialData {
  salary: number;
  hasExtraIncome: boolean;
  extraIncome: number;
  onboardingComplete: boolean;
}

export default function SettingsScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [salary, setSalary] = useState("");
  const [hasExtraIncome, setHasExtraIncome] = useState(false);
  const [extraIncome, setExtraIncome] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const financial = await AsyncStorage.getItem("userFinancialData");

      if (user) setUserData(JSON.parse(user));
      if (financial) {
        const data = JSON.parse(financial);
        setFinancialData(data);
        setSalary(data.salary.toFixed(2).replace(".", ","));
        setHasExtraIncome(data.hasExtraIncome);
        setExtraIncome(data.extraIncome.toFixed(2).replace(".", ","));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData: FinancialData = {
        salary: parseCurrency(salary),
        hasExtraIncome,
        extraIncome: hasExtraIncome ? parseCurrency(extraIncome) : 0,
        onboardingComplete: true,
      };

      await AsyncStorage.setItem(
        "userFinancialData",
        JSON.stringify(updatedData)
      );
      setFinancialData(updatedData);
      setIsEditing(false);
      Alert.alert("Sucesso", "Dados financeiros atualizados!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Limpar todos os dados",
      "Esta ação irá apagar TODAS as suas transações e configurações. Não é possível desfazer!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar tudo",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/auth/login");
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Conta</Text>
          <View style={styles.card}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>
              {userData?.email || "Não informado"}
            </Text>
          </View>
        </View>

        {/* Financial Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💰 Dados Financeiros</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Salário Mensal</Text>
              {isEditing ? (
                <View style={styles.currencyInputWrapper}>
                  <Text style={styles.currencyPrefix}>R$</Text>
                  <TextInput
                    style={styles.input}
                    value={salary}
                    onChangeText={(text) => setSalary(formatCurrency(text))}
                    keyboardType="numeric"
                    editable={isEditing}
                  />
                </View>
              ) : (
                <Text style={styles.value}>R$ {salary}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.switchRow}>
                <Text style={styles.label}>Possui Renda Extra</Text>
                <Switch
                  value={hasExtraIncome}
                  onValueChange={setHasExtraIncome}
                  disabled={!isEditing}
                  trackColor={{
                    false: Theme.colors.border,
                    true: Theme.colors.primary,
                  }}
                  thumbColor={
                    hasExtraIncome ? Theme.colors.primaryDark : "#f4f3f4"
                  }
                />
              </View>
            </View>

            {hasExtraIncome && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Valor da Renda Extra</Text>
                {isEditing ? (
                  <View style={styles.currencyInputWrapper}>
                    <Text style={styles.currencyPrefix}>R$</Text>
                    <TextInput
                      style={styles.input}
                      value={extraIncome}
                      onChangeText={(text) =>
                        setExtraIncome(formatCurrency(text))
                      }
                      keyboardType="numeric"
                      editable={isEditing}
                    />
                  </View>
                ) : (
                  <Text style={styles.value}>R$ {extraIncome}</Text>
                )}
              </View>
            )}

            {isEditing && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditing(false);
                    loadData();
                  }}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, saving && { opacity: 0.6 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color={Theme.colors.textPrimary} />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        {financialData && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>💎 Renda Total Mensal</Text>
            <Text style={styles.summaryValue}>
              R${" "}
              {(
                financialData.salary + financialData.extraIncome
              ).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        )}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Zona de Perigo</Text>

          <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
            <Text style={styles.dangerButtonText}>🚪 Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Text style={styles.dangerButtonText}>
              🗑️ Limpar Todos os Dados
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Finanças Pro v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Gerencie suas finanças com inteligência
          </Text>
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
  scrollContent: {
    padding: Theme.spacing.lg,
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
  editButton: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSize.md,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  inputContainer: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    fontWeight: "600",
  },
  value: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
  },
  currencyInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  currencyPrefix: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: "600",
    paddingVertical: Theme.spacing.md,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.md,
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
  summaryCard: {
    backgroundColor: Theme.colors.primary + "20",
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  summaryTitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  summaryValue: {
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
  dangerButton: {
    backgroundColor: Theme.colors.danger + "20",
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.danger,
  },
  dangerButtonText: {
    color: Theme.colors.danger,
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: Theme.spacing.xl,
    paddingTop: Theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  footerText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: "600",
  },
  footerSubtext: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
});
