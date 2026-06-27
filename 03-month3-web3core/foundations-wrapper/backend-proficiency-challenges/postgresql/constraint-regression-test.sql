-- ============================================================
-- CONSTRAINT REGRESSION TEST
-- Purpose: Verify all data integrity guards are active.
-- Every statement below MUST fail with a constraint error.
-- ============================================================

-- 1. NOT NULL violation: wallet address cannot be null
INSERT INTO wallets (address, label) VALUES (NULL, 'test');
-- Expected: ERROR:  null value in column "address" violates not-null constraint

-- 2. UNIQUE violation: duplicate wallet address
INSERT INTO wallets (address, label) VALUES ('0xwallet1', 'duplicate');
-- Expected: ERROR:  duplicate key value violates unique constraint "wallets_address_key"

-- 3. CHECK violation: negative token decimals
INSERT INTO tokens (symbol, name, decimals, contract_address) VALUES ('INVALID', 'BadToken', -1, '0xdead');
-- Expected: ERROR:  new row for relation "tokens" violates check constraint "tokens_decimals_check"

-- 4. FOREIGN KEY violation: wallet_id does not exist
INSERT INTO balances (wallet_id, token_id, balance_wei) VALUES (9999, 1, 100);
-- Expected: ERROR:  insert or update on table "balances" violates foreign key constraint "balances_wallet_id_fkey"

-- 5. Composite UNIQUE violation: same wallet/token pair already exists
INSERT INTO balances (wallet_id, token_id, balance_wei) VALUES (1, 1, 999);
-- Expected: ERROR:  duplicate key value violates unique constraint "balances_wallet_id_token_id_key"

-- 6. CHECK violation: negative balance
UPDATE balances SET balance_wei = -100 WHERE wallet_id = 1 AND token_id = 1;
-- Expected: ERROR:  new row for relation "balances" violates check constraint "balances_balance_wei_check"