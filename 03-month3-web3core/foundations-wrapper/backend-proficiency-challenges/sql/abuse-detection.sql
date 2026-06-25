INSERT INTO audit_log (wallet_address, is_successful, ip_address) VALUES
  ('0xabc', false, '10.0.0.1'),
  ('0xabc', false, '10.0.0.1'),
  ('0xabc', false, '10.0.0.1'),
  ('0xabc', false, '10.0.0.1'),
  ('0xabc', false, '10.0.0.1'),
  ('0xabc', false, '10.0.0.1');

-- Then run the detection query
SELECT wallet_address, COUNT(*)
FROM audit_log
WHERE created_at > NOW() - INTERVAL '1 hour' AND is_successful = false
GROUP BY wallet_address
HAVING COUNT(*) > 5;