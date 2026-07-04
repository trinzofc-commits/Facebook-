import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

export default function RegisterScreen() {
  const router = useRouter();
  const colors = useColors();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data: any) => {
      Alert.alert("Success", "Account created successfully! Please log in.");
      router.replace({
        pathname: "/(auth)/login",
        params: { email: data.email }
      } as any);
    },
    onError: (error: any) => {
      Alert.alert("Registration Failed", error.message || "Failed to create account");
    },
  });

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await registerMutation.mutateAsync({
        email,
        password,
        firstName,
        lastName,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-primary mb-2">f</Text>
            <Text className="text-2xl font-bold text-foreground">Create Account</Text>
            <Text className="text-sm text-muted mt-2">Join Facebook Clone today</Text>
          </View>

          {/* First Name Input */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground mb-2">First Name</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="First name"
              placeholderTextColor={colors.muted}
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
          </View>

          {/* Last Name Input */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground mb-2">Last Name</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="Last name"
              placeholderTextColor={colors.muted}
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />
          </View>

          {/* Email Input */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="Email address"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-foreground mb-2">Password</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="Create a password"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Confirm Password</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="Confirm password"
              placeholderTextColor={colors.muted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={cn(
              "w-full py-3 rounded-lg items-center justify-center mb-4",
              loading ? "bg-primary opacity-70" : "bg-primary"
            )}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-muted">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")} disabled={loading}>
              <Text className="text-primary font-semibold">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
