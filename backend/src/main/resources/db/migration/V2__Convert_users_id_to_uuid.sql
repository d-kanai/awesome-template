${create_pgcrypto_extension}

ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
${drop_users_id_sequence}

ALTER TABLE users
    ALTER COLUMN id ${users_id_uuid_type};

ALTER TABLE users ALTER COLUMN id SET DEFAULT ${users_id_uuid_default};
