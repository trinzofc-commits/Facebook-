import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function CreatePostScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const createPostMutation = trpc.social.createPost.useMutation({
    onSuccess: () => {
      Alert.alert("Success", "Post created successfully!");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to create post");
    },
  });

  const handleCreatePost = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to post");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await createPostMutation.mutateAsync({
        userId: user.id,
        content: content.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-row items-center justify-between p-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground">Create Post</Text>
        <TouchableOpacity 
          onPress={handleCreatePost} 
          disabled={loading || !content.trim()}
          className={cn(
            "px-4 py-1.5 rounded-full",
            loading || !content.trim() ? "bg-muted opacity-50" : "bg-primary"
          )}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold">Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="p-4 flex-row items-center gap-3">
        <Image
          source={{ uri: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}` }}
          className="w-10 h-10 rounded-full"
        />
        <View>
          <Text className="font-bold text-foreground">{user?.name || "User"}</Text>
          <View className="flex-row items-center bg-muted/30 px-2 py-0.5 rounded gap-1">
            <MaterialIcons name="public" size={12} color={colors.muted} />
            <Text className="text-xs text-muted">Public</Text>
            <MaterialIcons name="arrow-drop-down" size={12} color={colors.muted} />
          </View>
        </View>
      </View>

      <TextInput
        className="flex-1 p-4 text-lg text-foreground text-start"
        placeholder="What's on your mind?"
        placeholderTextColor={colors.muted}
        multiline
        value={content}
        onChangeText={setContent}
        autoFocus
      />

      <View className="border-t border-border p-4">
        <Text className="text-muted mb-3">Add to your post</Text>
        <View className="flex-row justify-around">
          <TouchableOpacity className="items-center">
            <MaterialIcons name="image" size={24} color="#45BD62" />
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="person-add" size={24} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="sentiment-satisfied" size={24} color="#F7B928" />
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="location-on" size={24} color="#F5533D" />
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="more-horiz" size={24} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
