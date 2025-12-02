CREATE TABLE IF NOT EXISTS notification_histories (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_type)
);

CREATE INDEX IF NOT EXISTS idx_notification_histories_user_id ON notification_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_histories_event_type ON notification_histories(event_type);
