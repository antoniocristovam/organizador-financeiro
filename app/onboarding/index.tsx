import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '@/constants/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [salary, setSalary] = useState('');
  const [hasExtraIncome, setHasExtraIncome] = useState(false);
  const [extraIncome, setExtraIncome] = useState('');

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSalaryChange = (text: string) => {
    setSalary(formatCurrency(text));
  };

  const handleExtraIncomeChange = (text: string) => {
    setExtraIncome(formatCurrency(text));
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!salary || parseCurrency(salary) === 0) {
        Alert.alert('Atenção', 'Por favor, informe seu salário mensal');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (hasExtraIncome) {
        setCurrentStep(3);
      } else {
        finishOnboarding();
      }
    } else if (currentStep === 3) {
      if (!extraIncome || parseCurrency(extraIncome) === 0) {
        Alert.alert('Atenção', 'Por favor, informe sua renda extra ou desative a opção');
        return;
      }
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = async () => {
    try {
      const userData = {
        salary: parseCurrency(salary),
        hasExtraIncome,
        extraIncome: hasExtraIncome ? parseCurrency(extraIncome) : 0,
        onboardingComplete: true,
      };

      await AsyncStorage.setItem('userFinancialData', JSON.stringify(userData));
      
      // Redireciona para o dashboard
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar seus dados. Tente novamente.');
    }
  };

  const renderProgressBar = () => {
    const totalSteps = hasExtraIncome ? 3 : 2;
    const progress = (currentStep / totalSteps) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Passo {currentStep} de {totalSteps}
        </Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>💰</Text>
      <Text style={styles.stepTitle}>Qual seu salário mensal?</Text>
      <Text style={styles.stepSubtitle}>
        Informe o valor líquido que você recebe mensalmente
      </Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.currencyPrefix}>R$</Text>
        <TextInput
          style={styles.currencyInput}
          placeholder="0,00"
          placeholderTextColor={Theme.colors.textSecondary}
          value={salary}
          onChangeText={handleSalaryChange}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.hint}>
        💡 Use apenas o valor que cai na sua conta
      </Text>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>💸</Text>
      <Text style={styles.stepTitle}>Você tem renda extra?</Text>
      <Text style={styles.stepSubtitle}>
        Freelance, vendas, investimentos ou outras fontes de renda
      </Text>

      <View style={styles.switchContainer}>
        <View style={styles.switchOption}>
          <View>
            <Text style={styles.switchLabel}>Possuo renda extra</Text>
            <Text style={styles.switchDescription}>
              {hasExtraIncome ? 'Vamos configurar no próximo passo' : 'Ative para configurar'}
            </Text>
          </View>
          <Switch
            value={hasExtraIncome}
            onValueChange={setHasExtraIncome}
            trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
            thumbColor={hasExtraIncome ? Theme.colors.primaryDark : '#f4f3f4'}
          />
        </View>
      </View>

      {!hasExtraIncome && (
        <Text style={styles.hint}>
          💡 Você pode adicionar renda extra depois nas configurações
        </Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>📊</Text>
      <Text style={styles.stepTitle}>Quanto você ganha de extra?</Text>
      <Text style={styles.stepSubtitle}>
        Informe uma estimativa média mensal
      </Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.currencyPrefix}>R$</Text>
        <TextInput
          style={styles.currencyInput}
          placeholder="0,00"
          placeholderTextColor={Theme.colors.textSecondary}
          value={extraIncome}
          onChangeText={handleExtraIncomeChange}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>📈 Sua renda total mensal</Text>
        <Text style={styles.summaryValue}>
          R$ {(parseCurrency(salary) + parseCurrency(extraIncome)).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <View style={styles.summaryBreakdown}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Salário</Text>
            <Text style={styles.summaryAmount}>R$ {salary}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Extra</Text>
            <Text style={[styles.summaryAmount, { color: Theme.colors.success }]}>
              R$ {extraIncome || '0,00'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderProgressBar()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
              <Text style={styles.secondaryButtonText}>← Voltar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.primaryButton, currentStep > 1 && { flex: 1 }]}
            onPress={handleNext}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === 3 || (currentStep === 2 && !hasExtraIncome)
                ? 'Finalizar'
                : 'Continuar →'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Theme.spacing.lg,
  },
  progressContainer: {
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.lg,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: Theme.colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.sm,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: Theme.spacing.lg,
  },
  stepTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  stepSubtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    width: '100%',
  },
  currencyPrefix: {
    fontSize: Theme.fontSize.xl,
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
    marginRight: Theme.spacing.sm,
  },
  currencyInput: {
    flex: 1,
    fontSize: Theme.fontSize.xl,
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
    paddingVertical: Theme.spacing.lg,
  },
  hint: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  switchContainer: {
    width: '100%',
    marginBottom: Theme.spacing.lg,
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  switchLabel: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  switchDescription: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  summaryBox: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    width: '100%',
    marginTop: Theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: Theme.fontSize.xxl,
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
  },
  summaryBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.lg,
  },
  secondaryButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
});
