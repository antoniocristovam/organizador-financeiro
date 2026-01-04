import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Theme } from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    // Simulação de autenticação
    // TODO: Integrar com backend real
    try {
      const userData = {
        email,
        authenticated: true,
        onboardingComplete: false,
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));

      // Redireciona para onboarding na primeira vez
      router.replace("/onboarding");
    } catch (error) {
      Alert.alert("Erro", "Falha ao autenticar. Tente novamente.");
    }
  };

  const handleSocialAuth = async (provider: "google" | "apple") => {
    // TODO: Implementar autenticação social
    Alert.alert("Em breve", `Login com ${provider} será implementado em breve`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>💰</Text>
          <Text style={styles.title}>Finanças Pro</Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? "Entre para gerenciar suas finanças"
              : "Crie sua conta gratuitamente"}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={Theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleAuth}>
            <Text style={styles.primaryButtonText}>
              {isLogin ? "Entrar" : "Criar conta"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialAuth("google")}
          >
            <Text style={styles.socialButtonText}>🔍 Continuar com Google</Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialAuth("apple")}
            >
              <Text style={styles.socialButtonText}>
                🍎 Continuar com Apple
              </Text>
            </TouchableOpacity>
          )}

          {/* Toggle Login/Register */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.toggleLink}>
                {isLogin ? "Cadastre-se" : "Entrar"}
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    padding: Theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Theme.spacing.xxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
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
  input: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Theme.spacing.lg,
  },
  forgotPasswordText: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSize.sm,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  primaryButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  dividerText: {
    color: Theme.colors.textSecondary,
    paddingHorizontal: Theme.spacing.md,
    fontSize: Theme.fontSize.sm,
  },
  socialButton: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  socialButtonText: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.fontSize.md,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Theme.spacing.lg,
  },
  toggleText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.sm,
    marginRight: Theme.spacing.sm,
  },
  toggleLink: {
    color: Theme.colors.primary,
    fontSize: Theme.fontSize.sm,
    fontWeight: "bold",
  },
});
