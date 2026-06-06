import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core"

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  amount: numeric("amount"),
  token: text("token"),
  sender: text("sender"),
  createdAt: timestamp("created_at").defaultNow(),
})
