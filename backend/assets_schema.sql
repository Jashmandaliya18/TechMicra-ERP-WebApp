USE techmicra_erp;

DROP TABLE IF EXISTS asset_additions;
DROP TABLE IF EXISTS asset_allocations;
DROP TABLE IF EXISTS asset_sales;
DROP TABLE IF EXISTS asset_depreciations;
DROP TABLE IF EXISTS asset_masters;

CREATE TABLE asset_masters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_tag VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    `group` ENUM('IT', 'Plant', 'Furniture') NOT NULL,
    purchase_date DATE NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    status ENUM('Active', 'Allocated', 'Disposed') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE asset_additions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    addition_id VARCHAR(255) NOT NULL UNIQUE,
    asset_tag VARCHAR(255) NOT NULL,
    invoice_ref VARCHAR(255) NOT NULL,
    installation_date DATE NOT NULL,
    depreciation_rate_percent DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (asset_tag) REFERENCES asset_masters(asset_tag) ON DELETE CASCADE
);

CREATE TABLE asset_allocations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    allocation_id VARCHAR(255) NOT NULL UNIQUE,
    asset_tag VARCHAR(255) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    date_assigned DATE NOT NULL,
    date_returned DATE NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (asset_tag) REFERENCES asset_masters(asset_tag) ON DELETE CASCADE
);

CREATE TABLE asset_sales (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_id VARCHAR(255) NOT NULL UNIQUE,
    asset_tag VARCHAR(255) NOT NULL,
    sale_date DATE NOT NULL,
    sale_value DECIMAL(15, 2) NOT NULL,
    book_value DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (asset_tag) REFERENCES asset_masters(asset_tag) ON DELETE CASCADE
);

CREATE TABLE asset_depreciations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    depreciation_id VARCHAR(255) NOT NULL UNIQUE,
    year INT NOT NULL,
    asset_tag VARCHAR(255) NOT NULL,
    opening_balance DECIMAL(15, 2) NOT NULL,
    depreciation_amount DECIMAL(15, 2) NOT NULL,
    closing_balance DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (asset_tag) REFERENCES asset_masters(asset_tag) ON DELETE CASCADE
);
