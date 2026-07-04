import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ProfileScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="bg-background p-0">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View className="relative">
          <Image
            source={{ uri: "https://via.placeholder.com/400x200?text=Cover" }}
            className="w-full h-40 bg-border"
          />
          <TouchableOpacity className="absolute top-3 right-3 bg-surface rounded-full p-2 border border-border">
            <MaterialIcons name="edit" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="px-4 pb-4">
          {/* Avatar and Name */}
          <View className="flex-row items-flex-end -mt-12 mb-4">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=0" }}
              className="w-24 h-24 rounded-full border-4 border-background"
            />
            <View className="flex-1 ml-4 mb-2">
              <Text className="text-2xl font-bold text-foreground">Your Name</Text>
              <Text className="text-sm text-muted">@yourprofile</Text>
            </View>
          </View>

          {/* Bio */}
          <View className={cn("bg-surface rounded-lg p-3 mb-4", "border border-border")}>
            <Text className="text-sm text-foreground leading-relaxed">
              Passionate developer | Coffee lover ☕ | Tech enthusiast 💻
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mb-4">
            <View className={cn("flex-1 bg-surface rounded-lg p-3 items-center", "border border-border")}>
              <Text className="text-xl font-bold text-primary">234</Text>
              <Text className="text-xs text-muted mt-1">Friends</Text>
            </View>
            <View className={cn("flex-1 bg-surface rounded-lg p-3 items-center", "border border-border")}>
              <Text className="text-xl font-bold text-primary">45</Text>
              <Text className="text-xs text-muted mt-1">Posts</Text>
            </View>
            <View className={cn("flex-1 bg-surface rounded-lg p-3 items-center", "border border-border")}>
              <Text className="text-xl font-bold text-primary">1.2K</Text>
              <Text className="text-xs text-muted mt-1">Followers</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity className={cn("flex-1 py-2 rounded-lg items-center", "bg-primary")}>
              <Text className="text-white font-semibold">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className={cn("flex-1 py-2 rounded-lg items-center border", "border-border")}>
              <Text className="text-foreground font-semibold">Share Profile</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className={cn("bg-surface rounded-lg p-4 mb-4", "border border-border")}>
            <Text className="text-lg font-bold text-foreground mb-3">About</Text>
            <View className="gap-3">
              <View className="flex-row items-center">
                <MaterialIcons name="location-on" size={18} color={colors.primary} />
                <Text className="ml-3 text-foreground">San Francisco, CA</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="work" size={18} color={colors.primary} />
                <Text className="ml-3 text-foreground">Software Engineer at Tech Co</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="school" size={18} color={colors.primary} />
                <Text className="ml-3 text-foreground">Studied at University</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="cake" size={18} color={colors.primary} />
                <Text className="ml-3 text-foreground">Born on January 1, 1990</Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View className={cn("bg-surface rounded-lg overflow-hidden", "border border-border")}>
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border">
              <View className="flex-row items-center">
                <MaterialIcons name="privacy-tip" size={20} color={colors.primary} />
                <Text className="ml-3 text-foreground font-semibold">Privacy Settings</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border">
              <View className="flex-row items-center">
                <MaterialIcons name="security" size={20} color={colors.primary} />
                <Text className="ml-3 text-foreground font-semibold">Security</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <MaterialIcons name="logout" size={20} color="#E74C3C" />
                <Text className="ml-3 text-red-500 font-semibold">Log Out</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
