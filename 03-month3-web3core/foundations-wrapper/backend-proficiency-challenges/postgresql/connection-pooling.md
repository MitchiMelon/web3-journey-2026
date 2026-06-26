**What is a database connection pool?**
A database connection pool is a cache of reusable database connections. Instead of opening a new connection for every request, the application borrows an existing idle connection from the pool, uses it to run a query, and then returns it to the pool. This avoids the overhead of establishing new connections repeatedly.

**Why is it necessary in a production backend?**
Without a pool, each API request would open a brand‑new database connection, which takes time and consumes server resources. Under heavy load, the database would quickly reach its connection limit (default 100), causing new requests to fail. A pool reuses a small, fixed number of connections, ensuring predictable performance and preventing connection exhaustion.

**Name one tool or library that implements connection pooling in a Node.js / PostgreSQL stack.**
The pg library provides built‑in pooling via new Pool(). When you used Drizzle ORM with new Pool({ connectionString: … }), you were using the pg pool under the hood. PgBouncer is another option for external, high‑scale connection pooling.
