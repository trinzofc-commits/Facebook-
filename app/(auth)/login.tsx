import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data: any) => {
      // Save token and user data
      console.log("Login successful:", data);
      // Navigate to home screen
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      Alert.alert("Login Failed", error.message || "Invalid email or password");
    },
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await loginMutation.mutateAsync({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-8">
          {/* Logo Section */}
          <View className="items-center mb-8">
            <Text className="text-5xl font-bold text-primary mb-2">f</Text>
            <Text className="text-2xl font-bold text-foreground">Facebook Clone</Text>
            <Text className="text-sm text-muted mt-2">Connect with friends and family</Text>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Email or Phone</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="Enter your email"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Password</Text>
            <TextInput
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-surface text-foreground",
                "border-border"
              )}
              placeholder="Enter your password"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={cn(
              "w-full py-3 rounded-lg items-center justify-center mb-4",
              loading ? "bg-primary opacity-70" : "bg-primary"
            )}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Log In</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity className="items-center mb-6">
            <Text className="text-primary font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="px-3 text-muted text-sm">OR</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            className="w-full py-3 rounded-lg items-center justify-center border-2 border-primary"
            onPress={() => router.push("/(auth)/register")}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-primary font-bold text-base">Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
