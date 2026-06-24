CREATE TABLE audit_log (
  uid SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  is_successful BOOLEAN NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE ROLE app_user WITH LOGIN;
GRANT INSERT, SELECT ON audit_log TO app_user;
REVOKE UPDATE, DELETE ON audit_log FROM app_user;