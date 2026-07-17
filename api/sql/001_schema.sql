-- EzeeFin platform — MySQL schema (migration 001)
-- utf8mb4 throughout; InnoDB; FKs on.

CREATE TABLE staff_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('consultant','admin') NOT NULL DEFAULT 'consultant',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE customers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(190) NULL,
  city VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_customers_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE leads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(12) NOT NULL UNIQUE,
  journey ENUM('find','found','fleet') NOT NULL,
  name VARCHAR(160) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(120) NULL,
  payload JSON NULL,
  consent_version VARCHAR(24) NOT NULL,
  status ENUM('new','qualified','converted','closed') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leads_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE customer_consents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_reference VARCHAR(12) NULL,
  customer_id INT UNSIGNED NULL,
  wording_version VARCHAR(24) NOT NULL,
  granted_at DATETIME NOT NULL,
  ip VARCHAR(45) NULL,
  -- immutable: no UPDATE grants on this table; superseding rows are inserted
  FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(12) NOT NULL UNIQUE,
  customer_id INT UNSIGNED NOT NULL,
  customer_name VARCHAR(160) NOT NULL,
  vehicle_need VARCHAR(400) NOT NULL,
  budget VARCHAR(160) NULL,
  stage ENUM('received','review','sourcing','options','finance','insurance','delivery-prep','delivered','closed') NOT NULL DEFAULT 'received',
  consultant VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_applications_stage (stage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE application_status_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  stage VARCHAR(24) NOT NULL,
  changed_by VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dealerships (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  city VARCHAR(120) NULL,
  contact_name VARCHAR(120) NULL,
  contact_phone VARCHAR(20) NULL,
  notes TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vehicle_options (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  dealership_id INT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  year SMALLINT NULL,
  price INT UNSIGNED NOT NULL,
  est_instalment INT UNSIGNED NULL,
  mileage VARCHAR(40) NULL,
  dealership VARCHAR(190) NULL,
  image VARCHAR(255) NULL,
  notes VARCHAR(400) NULL,
  published TINYINT(1) NOT NULL DEFAULT 0,
  selected TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id),
  FOREIGN KEY (dealership_id) REFERENCES dealerships(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE document_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  label VARCHAR(190) NOT NULL,
  status ENUM('requested','uploaded','verified','rejected') NOT NULL DEFAULT 'requested',
  file_name VARCHAR(255) NULL,       -- display name only
  storage_path VARCHAR(255) NULL,    -- opaque path OUTSIDE web root
  uploaded_at DATETIME NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  label VARCHAR(255) NOT NULL,
  who ENUM('customer','staff') NOT NULL,
  done TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  sender ENUM('customer','staff') NOT NULL,
  author VARCHAR(120) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE otp_codes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor VARCHAR(190) NOT NULL,
  action VARCHAR(80) NOT NULL,
  entity VARCHAR(80) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  detail JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_entity (entity, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE rate_hits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bucket VARCHAR(40) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  at DATETIME NOT NULL,
  INDEX idx_rate (bucket, ip, at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
