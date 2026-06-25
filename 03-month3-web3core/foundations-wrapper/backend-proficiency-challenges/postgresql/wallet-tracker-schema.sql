DROP TABLE IF EXISTS balances CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;

CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  address TEXT Not NULL UNIQUE,
  label TEXT,
  first_seen_block INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT,
  decimals INTEGER CHECK (decimals >= 0),
  contract_address TEXT UNIQUE
);
  
CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id),
	token_id INTEGER NOT NULL REFERENCES tokens(id),
  UNIQUE (wallet_id, token_id),
  balance_wei BIGINT NOT NULL DEFAULT 0 CHECK (balance_wei >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO wallets (address, label, first_seen_block) VALUES
  ('0xwallet1', 'Alice', 1000),
  ('0xwallet2', 'Bob', 1001),
  ('0xwallet3', 'Charlie', 1002),
  ('0xwallet4', 'Diana', 1003),
  ('0xwallet5', 'Eve', 1004);

INSERT INTO tokens (symbol, name, decimals, contract_address) VALUES
  ('ETH', 'Ether', 18, '0xethaddr'),
  ('USDC', 'USD Coin', 6, '0xusdcaddr'),
  ('DAI', 'Dai Stablecoin', 18, '0xdaiaddr');

INSERT INTO balances (wallet_id, token_id, balance_wei) VALUES
  (1, 1, 5000000000000000000),
  (1, 2, 1000000),
  (1, 3, 0),
  (2, 1, 1000000000000000000),
  (2, 2, 2000000),
  (2, 3, 5000000000000000000),
  (3, 1, 0),
  (3, 2, 500000),
  (3, 3, 1000000000000000000),
  (4, 1, 2000000000000000000),
  (4, 2, 3000000),
  (4, 3, 0),
  (5, 1, 100000000000000000),
  (5, 2, 1500000),
  (5, 3, 7500000000000000000);