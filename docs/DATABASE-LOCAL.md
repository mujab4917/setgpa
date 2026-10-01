# Your local database

Your PC has a **portable PostgreSQL 17.11**. It was installed without admin
rights, which means it is *not* a Windows service and does **not** start
automatically when you boot the PC.

## What is where

| Thing | Location |
| --- | --- |
| PostgreSQL programs | `%LOCALAPPDATA%\Programs\pgsql` |
| Database files (your data) | `%LOCALAPPDATA%\Programs\pgsql-data` |
| Server log | `%LOCALAPPDATA%\Programs\pgsql-data\server.log` |
| Database name | `gpa_calculator` |
| Username | `postgres` |
| Password | stored in your local `.env` (`DATABASE_URL`); not written here so this file is safe to publish |
| Port | `5432` |

`%LOCALAPPDATA%` is `C:\Users\<you>\AppData\Local`.

The password is a **local development password**. This server only listens on
your own machine, and the password is already in `.env`, which Git ignores. Use
a different password for any real/hosted database.

## Everyday use

Start the database (once per session, before `npm run dev`):

```bash
npm run db:start
```

Then:

```bash
npm run dev
```

Stop it when you are done (optional — it also stops when you restart the PC):

```bash
npm run db:stop
```

If you forget to start it, the site shows the "Something went wrong" page and
the terminal says `Can't reach database server at localhost:5432`.

## Browsing the data

```bash
npm run db:studio
```

Opens Prisma Studio at <http://localhost:5555>. The database must be running.

You can also use `psql` directly:

```bash
& "$env:LOCALAPPDATA\Programs\pgsql\bin\psql.exe" -U postgres -d gpa_calculator
```

## Switching to a normal PostgreSQL install later

A normal install registers a Windows service that starts on boot, so you never
have to run `npm run db:start` again. When you are ready:

1. Install PostgreSQL from <https://www.postgresql.org/download/windows/>
   (needs one admin/UAC click).
2. Create a database called `gpa_calculator` in pgAdmin.
3. Change the password in `DATABASE_URL` in `.env` to the one you set during
   that install.
4. Run `npx prisma migrate deploy` then `npm run db:seed`.
5. Delete the two portable folders listed above, and delete
   `scripts/start-database.ps1`, `scripts/stop-database.ps1` and the
   `db:start` / `db:stop` entries in `package.json`.

## Removing the portable database completely

Stop it first (`npm run db:stop`), then delete both folders:

```bash
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Programs\pgsql", "$env:LOCALAPPDATA\Programs\pgsql-data"
```

That deletes the PostgreSQL programs **and all data in them**. Your project
files are untouched, and `npm run db:seed` rebuilds the demo content on any new
database.
