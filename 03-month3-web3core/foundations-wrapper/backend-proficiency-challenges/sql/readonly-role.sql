CREATE ROLE readonly_user WITH LOGIN PASSWORD 'testreadonly';
GRANT SELECT ON wallets_demo TO readonly_user;
