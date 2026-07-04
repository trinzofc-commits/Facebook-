import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
  status: "friend" | "pending" | "stranger";
}

const MOCK_FRIENDS: Friend[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    mutualFriends: 12,
    status: "friend",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    mutualFriends: 8,
    status: "friend",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    mutualFriends: 5,
    status: "pending",
  },
  {
    id: 4,
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    mutualFriends: 15,
    status: "friend",
  },
  {
    id: 5,
    name: "Tom Brown",
    avatar: "https://i.pravatar.cc/150?img=5",
    mutualFriends: 3,
    status: "stranger",
  },
];

export default function FriendsScreen() {
  const colors = useColors();

  const renderFriend = ({ item }: { item: Friend }) => (
    <View className={cn("bg-surface rounded-lg p-3 mb-3", "border border-border")}>
      <View className="flex-row items-center">
        <Image source={{ uri: item.avatar }} className="w-16 h-16 rounded-lg mr-3" />
        <View className="flex-1">
          <Text className="font-bold text-foreground text-base">{item.name}</Text>
          <Text className="text-xs text-muted">{item.mutualFriends} mutual friends</Text>
        </View>
        {item.status === "friend" && (
          <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-2">
            <Text className="text-foreground text-sm font-semibold">Friends</Text>
          </TouchableOpacity>
        )}
        {item.status === "pending" && (
          <TouchableOpacity className="bg-primary rounded-lg px-4 py-2">
            <Text className="text-white text-sm font-semibold">Confirm</Text>
          </TouchableOpacity>
        )}
        {item.status === "stranger" && (
          <TouchableOpacity className="bg-primary rounded-lg px-4 py-2">
            <Text className="text-white text-sm font-semibold">Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background p-3">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground">Friends</Text>
      </View>
      <FlatList
        data={MOCK_FRIENDS}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </ScreenContainer>
  );
}
