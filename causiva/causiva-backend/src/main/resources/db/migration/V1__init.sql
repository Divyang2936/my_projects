CREATE TABLE users (
 id UUID PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 password_hash VARCHAR(255),
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100),
 provider VARCHAR(30) NOT NULL DEFAULT 'LOCAL',
 provider_subject VARCHAR(255),
 role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
 points INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL
);
CREATE UNIQUE INDEX ux_users_provider_subject ON users(provider, provider_subject) WHERE provider_subject IS NOT NULL;
CREATE TABLE products (
 id UUID PRIMARY KEY,
 slug VARCHAR(180) NOT NULL UNIQUE,
 name VARCHAR(255) NOT NULL,
 tagline VARCHAR(500),
 description TEXT,
 price NUMERIC(12,2) NOT NULL,
 original_price NUMERIC(12,2) NOT NULL,
 volume VARCHAR(50) NOT NULL,
 image_url VARCHAR(500),
 rating NUMERIC(3,2) NOT NULL DEFAULT 0,
 reviews_count INTEGER NOT NULL DEFAULT 0,
 badge VARCHAR(80),
 active BOOLEAN NOT NULL DEFAULT TRUE,
 stock INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE product_attributes (product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE, attribute_type VARCHAR(30) NOT NULL, value VARCHAR(150) NOT NULL);
CREATE TABLE product_ingredients (product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE, name VARCHAR(150) NOT NULL, percentage VARCHAR(30), purpose VARCHAR(500));
CREATE TABLE addresses (
 id UUID PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name VARCHAR(150) NOT NULL,
 address_line VARCHAR(500) NOT NULL,
 city VARCHAR(100) NOT NULL,
 state VARCHAR(100) NOT NULL,
 pin_code VARCHAR(20) NOT NULL,
 phone VARCHAR(30) NOT NULL,
 is_default BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE TABLE orders (
 id UUID PRIMARY KEY,
 order_number VARCHAR(40) NOT NULL UNIQUE,
 user_id UUID NOT NULL REFERENCES users(id),
 status VARCHAR(40) NOT NULL,
 payment_method VARCHAR(30) NOT NULL,
 subtotal NUMERIC(12,2) NOT NULL,
 shipping_fee NUMERIC(12,2) NOT NULL,
 total NUMERIC(12,2) NOT NULL,
 email VARCHAR(255) NOT NULL,
 phone VARCHAR(30) NOT NULL,
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100),
 address_line VARCHAR(500) NOT NULL,
 city VARCHAR(100) NOT NULL,
 state VARCHAR(100) NOT NULL,
 pin_code VARCHAR(20) NOT NULL,
 created_at TIMESTAMPTZ NOT NULL,
 updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE TABLE order_items (
 id UUID PRIMARY KEY,
 order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id UUID NOT NULL REFERENCES products(id),
 product_name VARCHAR(255) NOT NULL,
 volume VARCHAR(50) NOT NULL,
 unit_price NUMERIC(12,2) NOT NULL,
 quantity INTEGER NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);
