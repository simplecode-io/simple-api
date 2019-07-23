ALTER TABLE users
    ADD reset_password_token VARCHAR(128) UNIQUE,
    ADD reset_password_expires BIGINT,
    ADD reset_password_token_used BOOLEAN;