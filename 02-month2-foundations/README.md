# Web3 Journey 2026: Month 2

The second month was about building a foundation as a backend engineer. This experience created a new perspective: software engineering isn’t just about writing code, it’s about understanding the architecture of a virtual venue. This month I focused on servers, databases, schemas, frameworks, and APIs.

## My Learning Rules

- AI only for errors
- AI will not generate code
- AI provides final and alternative code (more concise and readable) only after my code is reviewed and working flawlessly
- Minimal autocomplete and ghost suggestions in VS Code (only variable and function name suggestions)
- Always pseudocode before code

## Month 2 Chopper View Plan

- Terminal operations
- SQL & PostgreSQL fundamentals (psql, table design, JOINs, migrations)
- Node.js core (raw HTTP server, event loop, file I/O)
- Express.js (routing, middleware, REST API design)
- Drizzle ORM (schema definition, type‑safe queries, migrations)
- Environment variables (.env) and Git safety
- TS Async (intermediate & advanced: retries, concurrency, Promise.race/allSettled, polling, error handling)
- Scripting (SQL scripts, automation)
- API testing with curl
- Project rebuild from scratch (memory recall)

## Month 2 Journey and Learnings

### Backend Fundamentals

Learning to code and learning to be a backend engineer is a night and day experience. Honestly, it’s an eye opener for me. The complexity is completely different. This month made me appreciate real software engineering which is not as simple as writing code, but to understand an entire layered architecture. At the same time, I realised I need much more exposure and a rigid foundation in databases, data flows, frameworks, APIs, and servers.

#### Concrete wins (because reading back, it sounds like I did nothing)

- **PostgreSQL & SQL:** Installed PostgreSQL, created my `web3_learning` database, designed a `transactions` table, inserted real data, wrote queries with WHERE, GROUP BY, SUM, and JOINs, then saved everything into a reusable `.sql` script.
- **Node.js core:** Built a raw HTTP server using only the `http` module—manually parsed URLs, added routing, and logged requests to a file asynchronously. This showed me exactly what Express simplifies.
- **Express + raw SQL:** Connected Express to PostgreSQL with the `pg` library, replacing the in‑memory array with real database calls. Used parameterised queries to prevent SQL injection. Added `try/catch` so the server never crashes.
- **Drizzle ORM:** Defined a schema in TypeScript (`pgTable`), synced it to the live database without data loss, and replaced raw SQL strings with type‑safe queries (`db.select()`, `where(eq(...))`, `insert()`, `returning()`). Built a filter route (`GET /transactions?token=USDC`) and added input validation.
- **Rebuilt from memory:** After all the guided work, I created a completely new project (`test-backend`) from scratch with minimum assistance. I initialised npm, installed all dependencies, wrote the schema, db connection, and full Express server with Drizzle, and tested it with `curl`. It worked. That proved the concepts actually stuck.
- **Environment protection:** Learned why `.env` must never be committed, added it to `.gitignore`, and removed it from tracking when needed.
- **Git recovery:** Accidentally deleted the `asynchronous-foundations` folder on GitHub. Recovered it cleanly using Git history (`git checkout <commit> -- <path>`) and learned how to abort a mistaken revert.

### TS Async (Intermediate and Advance)

The more I challenged myself with complex async patterns, the more I realised how broken my fundamentals were, especially around HoF and callbacks. Working on them cluelessly and asking AI for assistance didn’t let me understand the syntax and logic flow deeply. Therefore, I will build a buffer and wrapper week at the start of Month 3 to restructure and fortify my foundations again before I touch Solidity.

## Progression Summary & Opinions

Month 2 was a choppy experience. During weeks 2–4 I got tennis elbow that hindered my progression. I couldn’t even straighten my hands and was in pain for days. But the struggle can’t only be blamed on my elbow. The journey to understand backend fundamentals, frameworks, servers, and databases is just hard. The more I learn, the more I feel that if I miss even one hair of the basics, there will be severe consequences later in my career as a blockchain engineer.

The experience in Month 2 is not satisfactory, but it’s a loud and honest wake‑up call. I see exactly what I don’t know and that’s more valuable than false confidence.

**Month 2 Timeline:** 11 May 2026 - 7 June 2026

**Month 2 Total Hours Spent:** 110 hours

---

_Follow along or connect with me on X [@omelon90](https://x.com/omelon90)_
