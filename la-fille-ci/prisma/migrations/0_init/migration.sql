-- CreateTable
CREATE TABLE products (
    id Int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt DateTime DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DateTime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE orders (
    id Int AUTO_INCREMENT PRIMARY KEY,
    userId Int,
    email VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zipCode VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    total Float NOT NULL,
    status VARCHAR(255) DEFAULT 'pending' NOT NULL,
    paymentIntent VARCHAR(255),
    createdAt DateTime DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DateTime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE order_items (
    id Int AUTO_INCREMENT PRIMARY KEY,
    orderId Int NOT NULL,
    productId Int NOT NULL,
    quantity Int NOT NULL,
    price Float NOT NULL,
    CONSTRAINT order_items_orderId_fkey FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE wishlist_items (
    id Int AUTO_INCREMENT PRIMARY KEY,
    userId Int,
    productId Int NOT NULL,
    createdAt DateTime DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT wishlist_items_productId_fkey FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE users (
    id Int AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phone VARCHAR(255),
    createdAt DateTime DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- CreateIndex
CREATE INDEX order_items_orderId_idx ON order_items(orderId);

-- CreateIndex
CREATE INDEX order_items_productId_idx ON order_items(productId);

-- CreateIndex
CREATE INDEX wishlist_items_productId_idx ON wishlist_items(productId);
