DROP TABLE IF EXISTS wallets_demo;

CREATE TABLE wallets_demo (
  uid SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  label TEXT,
  balance BIGINT NOT NULL DEFAULT 0,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO wallets_demo (wallet_address, label, balance)
  VALUES 
  	('0xaaa123', 'first_mover', 100000000),
    ('0xbbb234', 'shrimp', 533),
    ('0xccc345', 'clam', 70),
    ('0xddd456', 'shark', 5000000),
    ('0xeee567', 'fisherman', 400800),
    ('0xfff678', 'first_mover', 10000000),
    ('0xggg789', '', 1600100),
    ('0xhhh890', 'zombie_account', 0),
    ('0xiii111', '', 0),
    ('0xjjj222', 'whale', 9700000000);

-- VULNERABLE VERSION: built by concatenating user input into the SQL string
SELECT * FROM wallets_demo WHERE wallet_address = '0xaaa123';
-- Attacker input: ' OR 1=1 --'
-- Result: 
SELECT * FROM wallets WHERE wallet_address = '' OR 1=1 --'
-- Attack effect: retrieves every wallet, because 1=1 is always true and the rest is commented out.

-- SECURE VERSION: parameterized query
-- The backend would use: SELECT * FROM wallets_demo WHERE wallet_address = $1;
-- and bind the user input separately, preventing injection.

-- Conclusion: parameterized queries separate code from data, preventing injection structurally.