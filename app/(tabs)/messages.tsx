import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you?",
    timestamp: "2 min ago",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "See you tomorrow!",
    timestamp: "1 hour ago",
    unread: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Thanks for the help",
    timestamp: "3 hours ago",
    unread: 1,
    isOnline: true,
  },
  {
    id: 4,
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Let's catch up soon",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: false,
  },
];

export default function MessagesScreen() {
  const colors = useColors();

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      className={cn(
        "flex-row items-center p-3 mb-2 rounded-lg",
        "bg-surface border border-border",
        item.unread > 0 && "bg-opacity-50"
      )}
    >
      <View className="relative mr-3">
        <Image source={{ uri: item.avatar }} className="w-14 h-14 rounded-full" />
        {item.isOnline && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface" />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className={cn("font-bold text-foreground", item.unread > 0 && "font-bold")}>
            {item.name}
          </Text>
          <Text className="text-xs text-muted">{item.timestamp}</Text>
        </View>
        <Text className={cn("text-sm text-muted truncate", item.unread > 0 && "text-foreground font-semibold")}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unread > 0 && (
        <View className="ml-2 bg-primary rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-white text-xs font-bold">{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background p-3">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-foreground">Messages</Text>
        <TouchableOpacity className="bg-primary rounded-full p-2">
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className={cn("flex-row items-center px-3 py-2 rounded-full mb-4", "bg-surface border border-border")}>
        <MaterialIcons name="search" size={20} color={colors.muted} />
        <Text className="ml-2 text-muted flex-1">Search conversations...</Text>
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </ScreenContainer>
  );
}
