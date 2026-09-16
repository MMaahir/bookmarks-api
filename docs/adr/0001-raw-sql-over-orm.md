# Use raw SQL (pg) instead of an ORM

The service has a small schema (one table) and simple queries. We chose
raw SQL through node-postgres, with schema changes as numbered SQL
migration files, over Drizzle or another ORM. Reason: this codebase is a
learning vehicle for platform engineering. Writing the SQL by hand keeps
the database visible, and an ORM's value is easier to judge after you
know what it hides. Revisit if query count and row-mapping code grow.
