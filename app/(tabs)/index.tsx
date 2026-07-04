import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Post {
  id: number;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    timestamp: "2 hours ago",
    content: "Just finished an amazing project! Feeling proud 🎉",
    image: "https://via.placeholder.com/400x300?text=Project",
    likes: 234,
    comments: 45,
    shares: 12,
    liked: false,
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    timestamp: "4 hours ago",
    content: "Beautiful sunset today! Nature is amazing 🌅",
    image: "https://via.placeholder.com/400x300?text=Sunset",
    likes: 567,
    comments: 89,
    shares: 34,
    liked: false,
  },
  {
    id: 3,
    author: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    timestamp: "6 hours ago",
    content: "Who else loves coding? Let's connect! 💻",
    likes: 123,
    comments: 23,
    shares: 5,
    liked: false,
  },
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: Post }) => (
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
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12 }}
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
                  onPress={() => router.push("/(tabs)" as any)}
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
