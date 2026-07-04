import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Notification {
  id: number;
  type: "like" | "comment" | "friend_request" | "message";
  actor: string;
  avatar: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "like",
    actor: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    message: "liked your post",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    actor: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    message: "commented on your post",
    timestamp: "15 min ago",
    read: false,
  },
  {
    id: 3,
    type: "friend_request",
    actor: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    message: "sent you a friend request",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "like",
    actor: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=4",
    message: "liked your comment",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "message",
    actor: "Tom Brown",
    avatar: "https://i.pravatar.cc/150?img=5",
    message: "sent you a message",
    timestamp: "Yesterday",
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return "favorite";
    case "comment":
      return "message";
    case "friend_request":
      return "person-add";
    case "message":
      return "mail";
    default:
      return "notifications";
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "like":
      return "#E74C3C";
    case "comment":
      return "#3498DB";
    case "friend_request":
      return "#2ECC71";
    case "message":
      return "#9B59B6";
    default:
      return "#95A5A6";
  }
};

export default function NotificationsScreen() {
  const colors = useColors();

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      className={cn(
        "flex-row items-center p-3 mb-2 rounded-lg",
        "border border-border",
        item.read ? "bg-background" : "bg-surface"
      )}
    >
      <View className="relative mr-3">
        <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
        <View
          className="absolute bottom-0 right-0 w-5 h-5 rounded-full items-center justify-center"
          style={{ backgroundColor: getNotificationColor(item.type) }}
        >
          <MaterialIcons name={getNotificationIcon(item.type)} size={12} color="white" />
        </View>
      </View>

      <View className="flex-1">
        <Text className={cn("text-sm", item.read ? "text-muted" : "text-foreground font-semibold")}>
          <Text className="font-bold">{item.actor}</Text> {item.message}
        </Text>
        <Text className="text-xs text-muted mt-1">{item.timestamp}</Text>
      </View>

      {!item.read && (
        <View className="ml-2 w-3 h-3 rounded-full bg-primary" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background p-3">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-foreground">Notifications</Text>
        <TouchableOpacity className="bg-surface border border-border rounded-full p-2">
          <MaterialIcons name="settings" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </ScreenContainer>
  );
}
