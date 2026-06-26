-- Lock down public schema
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Create audit schema and sample table
CREATE SCHEMA audit;
CREATE TABLE audit.registration_log (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO audit.registration_log (wallet_address) VALUES ('0xabc123');

-- Create group role and analyst login
CREATE ROLE audit_reader;
GRANT USAGE ON SCHEMA audit TO audit_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA audit TO audit_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit
  GRANT SELECT ON TABLES TO audit_reader;

CREATE ROLE analyst WITH LOGIN PASSWORD 'analyst123';
GRANT audit_reader TO analyst;