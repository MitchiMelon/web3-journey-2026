-- Drop if exists to start fresh
DROP TABLE IF EXISTS test_large;

-- Create the table
CREATE TABLE test_large (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL
);

-- Insert 50,000 rows using generate_series (this will be fast)
INSERT INTO test_large (value)
SELECT (random() * 1000)::INT + 1
FROM generate_series(1, 50000);

EXPLAIN ANALYZE SELECT * FROM test_large WHERE value = 500;

CREATE INDEX idx_test_large_value ON test_large (value);
-- Execution time dropped from ~4.2 ms (Seq Scan) to ~0.15 ms (Bitmap Index Scan)
-- EXPLAIN ANALYZE SELECT * FROM test_large WHERE value = 500;