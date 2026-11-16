ALTER TABLE orders
    ADD COLUMN idempotency_key VARCHAR(100),
    ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING';

CREATE UNIQUE INDEX ux_orders_user_idempotency
    ON orders(user_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;

CREATE UNIQUE INDEX ux_addresses_one_default_per_user
    ON addresses(user_id)
    WHERE is_default = TRUE;
