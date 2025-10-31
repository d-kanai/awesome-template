import { StyleSheet, Text, View } from "react-native";

import type { User } from "@/features/users/hooks/useUserList";

type Props = {
  user: User;
};

export function UserListItem({ user }: Props) {
  return (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.userMeta}>
        作成日: {user.createdAt?.toLocaleString() ?? "不明"} / 更新日:{" "}
        {user.updatedAt?.toLocaleString() ?? "不明"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  userEmail: {
    fontSize: 16,
    color: "#444",
  },
  userMeta: {
    fontSize: 14,
    color: "#777",
  },
});
