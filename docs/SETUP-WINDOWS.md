# VS Code setup guide (fresh Windows PC)

Follow these in order. Every command is run inside the **VS Code terminal**
(`Ctrl` + `` ` ``) with the project folder open, unless it says otherwise.

---

## 1. Required software

| Software | Why | Where |
| --- | --- | --- |
| Node.js 20 LTS or newer | Runs Next.js, npm, Prisma | <https://nodejs.org> |
| VS Code | Editor | <https://code.visualstudio.com> |
| Git | Version control | <https://git-scm.com/download/win> |
| PostgreSQL 16+ | The database | <https://www.postgresql.org/download/windows/> |

## 2. Install Node.js

**Option A — winget (fastest).** Windows 11 already has it. Run this in
PowerShell (it will show a UAC prompt):

```bash
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
```

**Option B — installer.**

1. Download the **LTS** Windows Installer (.msi) from <https://nodejs.org>.
2. Run it and accept the defaults (npm is included).
3. "Tools for Native Modules" is **not** needed — this project has no native
   dependencies.

Either way: **fully quit VS Code and close every terminal**, then reopen. Windows
only gives the new `PATH` to programs started after the install. Now check:

```bash
node -v
```

```bash
npm -v
```

The current LTS prints `v24.x.x` for Node and `11.x.x` for npm. Anything from
Node 20 upwards works. If `node` is still "not recognised" after reopening the
terminal, restart Windows so the PATH updates.

## 3. Install and set up VS Code

1. Install VS Code and open the project folder: **File → Open Folder…**
2. When VS Code asks about recommended extensions, accept. Otherwise install
   these manually (Ctrl+Shift+X):
   - **Prisma** (`Prisma.prisma`) — syntax highlighting for `schema.prisma`
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — class autocomplete
   - **Prettier** (`esbenp.prettier-vscode`) — formatting
   - **Vitest** (`vitest.explorer`) — run tests from the sidebar
3. Open the terminal with `Ctrl` + `` ` ``.

## 4. Set up Git

```bash
git --version
```

```bash
git config --global user.name "Your Name"
```

```bash
git config --global user.email "you@example.com"
```

If this project is not a Git repository yet:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

`.gitignore` already excludes `node_modules`, `.next` and `.env`, so your
database password is never committed.

## 5. Install PostgreSQL

**Use the official installer for this one**, not winget — the installer is what
prompts you to set the `postgres` password and installs pgAdmin, and you need
both.

1. Download the Windows installer from the EnterpriseDB link on
   <https://www.postgresql.org/download/windows/>. Version 17 or 18 is fine.
2. Run it. Keep **PostgreSQL Server**, **pgAdmin 4** and **Command Line Tools** ticked.
3. When it asks for a password for the `postgres` superuser, **choose one and
   write it down** — you need it in step 7.
4. Leave the port as **5432**.
5. Skip Stack Builder at the end.

Note the version number you installed. It appears in two places later: the
install folder `C:\Program Files\PostgreSQL\<version>\` and the Windows service
name `postgresql-x64-<version>`.

## 6. Create the database

Open **pgAdmin 4** (Start menu), enter the password from step 5, then:

- Expand **Servers → PostgreSQL → Databases**
- Right-click **Databases → Create → Database…**
- Name: `gpa_calculator`
- Save

Prefer the terminal? `psql` lives in `C:\Program Files\PostgreSQL\<version>\bin`
— replace `17` below with the version you installed:

```bash
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE gpa_calculator;"
```

## 7. Set the environment variables

Copy the template (PowerShell):

```bash
Copy-Item .env.example .env
```

Open `.env` in VS Code and edit two lines:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/gpa_calculator?schema=public"
NEXT_PUBLIC_WHATSAPP_NUMBER="923001234567"
```

- Replace `YOUR_PASSWORD` with the password from step 5.
- If your password contains `@`, `:`, `/` or `#`, percent-encode it
  (`@` → `%40`, `#` → `%23`).
- The WhatsApp number is digits only: country code + number, no `+`, no spaces.

Leave `NEXT_PUBLIC_SITE_URL` as `http://localhost:3000` until you have a domain.

## 8. Install dependencies

**If PowerShell says `npm.ps1 cannot be loaded because running scripts is
disabled on this system`**, that is Windows' PowerShell Execution Policy, not a
problem with npm. Allow local scripts for your own account (no admin needed),
answer `Y`, then reopen the terminal:

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

`RemoteSigned` lets scripts on your own PC run, while scripts downloaded from
the internet still have to be digitally signed. If you would rather not change
it, type `npm.cmd` instead of `npm`, or switch VS Code's terminal to Command
Prompt (`Ctrl+Shift+P` → "Terminal: Select Default Profile" → Command Prompt).

```bash
npm install
```

This creates `node_modules/` and, through the `postinstall` script, regenerates
the Prisma client so the database types match `schema.prisma`.

**If npm prints an `allow-scripts` warning**, read it. npm 11 and newer block
package install scripts by default as a supply-chain precaution. This project
needs four of them — Prisma downloads its query engine and esbuild downloads its
platform binary in exactly this way. Without them `prisma migrate` and
`npm test` both fail.

`package.json` already contains an `allowScripts` block approving those four, so
a normal `npm install` should be fine. If the warning still appears:

```bash
npm approve-scripts prisma "@prisma/client" "@prisma/engines" esbuild
```

```bash
npm rebuild prisma "@prisma/client" "@prisma/engines" esbuild
```

(`npm install` alone will say "up to date" and skip them — `npm rebuild` is what
actually runs the scripts.)

## 9. Prisma setup

Generate the typed database client from `prisma/schema.prisma`:

```bash
npx prisma generate
```

(`npm run db:generate` does the same thing.)

## 10. Run the migration

```bash
npx prisma migrate dev --name init
```

This creates the `City`, `University` and `GradeRule` tables in PostgreSQL and
saves the SQL in `prisma/migrations/`. Commit that folder to Git.

If it fails with an authentication error, `DATABASE_URL` in `.env` is wrong —
recheck the password and the database name.

## 11. Import the demo data

```bash
npm run db:seed
```

You should see Lahore and five universities printed in the terminal.

## 12. Start the development server

```bash
npm run dev
```

## 13. Open the website

Go to <http://localhost:3000>. Check the journey:

1. Homepage → **Lahore**
2. Lahore → five universities
3. A university → description, grade table, GPA calculator, CGPA calculator
4. The WhatsApp button at the bottom

Stop the server with `Ctrl` + `C`.

## 14. Check the database

In pgAdmin: **Databases → gpa_calculator → Schemas → public → Tables**, then
right-click a table → **View/Edit Data → All Rows**.

## 15. Use Prisma Studio

```bash
npm run db:studio
```

Opens <http://localhost:5555> with a spreadsheet-style editor for your tables.
Edit a description or a grade point, save, refresh the website and the change is
live. Stop it with `Ctrl` + `C`.

## 16. Build the production version

```bash
npm run build
```

This regenerates the Prisma client and compiles the site. It also pre-renders
the city and university pages, so the database must be running.

## 17. Run the production version

```bash
npm start
```

Serves the optimised build on <http://localhost:3000>.

---

## Running the tests

```bash
npm test
```

```bash
npm run test:watch
```

The tests cover `lib/calculators/` — GPA, CGPA, validation and rounding. They
do not need a database.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `node` is not recognised | Reopen the terminal, or restart Windows after installing Node. |
| `Can't reach database server at localhost:5432` | PostgreSQL service is not running. Open **Services** (Win+R → `services.msc`) and start `postgresql-x64-<version>`. |
| `Authentication failed for user "postgres"` | Wrong password in `DATABASE_URL`, or special characters that need percent-encoding. |
| `Environment variable not found: DATABASE_URL` | `.env` is missing or is not in the project root. |
| Site loads but there are no cities | You have not run `npm run db:seed`. |
| `Failed to collect page data` during `npm run build` | The build pre-renders pages from the database, so PostgreSQL must be running and seeded first. |
| `@prisma/client did not initialize yet` | Install scripts were blocked — see the `allow-scripts` note in step 8. |
| `npm.ps1 cannot be loaded because running scripts is disabled` | PowerShell Execution Policy — see step 8. |
| `Parameter 'x' implicitly has an 'any' type` in `lib/queries/*` | The Prisma client is missing. Run `npm run db:generate`. |
| Moved the project to a new folder and nothing works | `.env`, `.vscode/` and `node_modules` do not travel. Recreate `.env` from `.env.example` and run `npm install`. |
| Grade change in Prisma Studio does not show | Pages cache for an hour; restart `npm run dev` or wait for revalidation. |
| Port 3000 already in use | `npm run dev -- -p 3001` |
