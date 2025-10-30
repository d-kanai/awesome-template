package com.example.demo.modules.user.presentation.output;

import com.example.demo.modules.user.domain.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class FindAllUsersOutput {
    private List<UserItem> users;

    public FindAllUsersOutput(List<UserItem> users) {
        this.users = users;
    }

    public static FindAllUsersOutput from(List<User> users) {
        List<UserItem> items = users.stream()
            .map(UserItem::from)
            .collect(Collectors.toList());
        return new FindAllUsersOutput(items);
    }

    public List<UserItem> getUsers() {
        return users;
    }

    public static class UserItem {
        private Long id;
        private String email;
        private String name;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserItem(Long id, String email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }

        public static UserItem from(User user) {
            return new UserItem(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            );
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }
    }
}
