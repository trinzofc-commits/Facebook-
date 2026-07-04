import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { user } = useAuth();
  
  const { data: rawPosts, isLoading, refetch, isRefetching } = trpc.social.getFeed.useQuery({
    limit: 20,
  });

  const posts = useMemo(() => {
    if (!rawPosts) return [];
    return rawPosts.map((post: any) => ({
      id: post.id,
      author: "User " + post.userId, // In real app, we'd join user info
      avatar: `https://i.pravatar.cc/150?u=${post.userId}`,
      timestamp: new Date(post.createdAt).toLocaleDateString(),
      content: post.content || "",
      image: post.images?.[0],
      likes: post.likes || 0,
      comments: post.commentsCount || 0,
      shares: post.sharesCount || 0,
      liked: false, // In real app, we'd check if current user liked it
    }));
  }, [rawPosts]);

  const likeMutation = trpc.social.likePost.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = (postId: number) => {
    if (!user) return;
    likeMutation.mutate({ userId: user.id, postId });
  };

  const renderPost = ({ item }: { item: any }) => (
    <View className={cn("bg-surface rounded-lg mb-4 overflow-hidden", "border border-border")}>
      {/* Post Header */}
      <View className="flex-row items-center p-3 border-b border-border">
        <Image
          source={{ uri: item.avatar }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-bold text-foreground">{item.author}</Text>
          <Text className="text-xs text-muted">{item.timestamp}</Text>
        </View>
        <TouchableOpacity className="p-2">
          <MaterialIcons name="more-vert" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View className="px-3 py-2">
        <Text className="text-foreground text-base leading-relaxed">{item.content}</Text>
      </View>

      {/* Post Image */}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          className="w-full h-64 bg-border"
        />
      )}

      {/* Post Stats */}
      <View className="flex-row justify-between px-3 py-2 border-t border-b border-border text-xs text-muted">
        <Text className="text-muted text-xs">{item.likes} likes</Text>
        <View className="flex-row gap-2">
          <Text className="text-muted text-xs">{item.comments} comments</Text>
          <Text className="text-muted text-xs">{item.shares} shares</Text>
        </View>
      </View>

      {/* Post Actions */}
      <View className="flex-row">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-2"
          onPress={() => handleLike(item.id)}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={item.liked ? "favorite" : "favorite-outline"}
            size={18}
            color={item.liked ? "#E74C3C" : colors.muted}
          />
          <Text className={cn("ml-2 text-sm", item.liked ? "text-red-500" : "text-muted")}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2" activeOpacity={0.7}>
          <MaterialIcons name="message" size={18} color={colors.muted} />
          <Text className="ml-2 text-sm text-muted">Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2" activeOpacity={0.7}>
          <MaterialIcons name="share" size={18} color={colors.muted} />
          <Text className="ml-2 text-sm text-muted">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background p-0">
      {isLoading && !isRefetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        ListHeaderComponent={
          <View className="mb-4">
            {/* Create Post Section */}
            <View className={cn("bg-surface rounded-lg p-3 mb-4", "border border-border")}>
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=0" }}
                  className="w-10 h-10 rounded-full"
                />
                <TouchableOpacity
                  className={cn(
                    "flex-1 bg-background rounded-full px-4 py-2",
                    "border border-border"
                  )}
                  onPress={() => router.push("/create-post" as any)}
                >
                  <Text className="text-muted">What's on your mind?</Text>
                </TouchableOpacity>
              </View>

              {/* Quick Actions */}
              <View className="flex-row justify-around mt-3 pt-3 border-t border-border">
                <TouchableOpacity className="flex-row items-center gap-1">
                  <MaterialIcons name="image" size={18} color={colors.primary} />
                  <Text className="text-xs text-muted">Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <MaterialIcons name="videocam" size={18} color={colors.primary} />
                  <Text className="text-xs text-muted">Video</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <MaterialIcons name="sentiment-satisfied" size={18} color={colors.primary} />
                  <Text className="text-xs text-muted">Feeling</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stories Section */}
            <View className={cn("bg-surface rounded-lg p-3 mb-4", "border border-border")}>
              <Text className="font-bold text-foreground mb-3">Stories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity
                    key={i}
                    className={cn(
                      "w-24 h-40 rounded-lg overflow-hidden",
                      "bg-gradient-to-br from-primary to-blue-600"
                    )}
                  >
                    <Image
                      source={{ uri: `https://i.pravatar.cc/150?img=${i}` }}
                      className="w-full h-full"
                    />
                    <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <Text className="text-white text-xs font-semibold">User {i}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
