# Starts the local PostgreSQL server.
#
# This project uses a PORTABLE PostgreSQL: the binaries live in your user
# folder and there is no Windows service, so nothing starts automatically when
# you boot the PC. Run this script once per session before `npm run dev`.
#
#   powershell -ExecutionPolicy Bypass -File scripts\start-database.ps1
#
# If you later install PostgreSQL properly (with the EnterpriseDB installer),
# it registers a Windows service that starts on boot and you can delete this
# script and its partner stop-database.ps1.

$ErrorActionPreference = "Stop"

$pgHome = Join-Path $env:LOCALAPPDATA "Programs\pgsql"
$pgData = Join-Path $env:LOCALAPPDATA "Programs\pgsql-data"
$logFile = Join-Path $pgData "server.log"

$pgCtl = Join-Path $pgHome "bin\pg_ctl.exe"

if (-not (Test-Path $pgCtl)) {
    Write-Error "PostgreSQL binaries not found at $pgHome. See docs/DATABASE-LOCAL.md."
}

# `pg_ctl status` exits non-zero when the server is not running, which is not
# an error for us - so ask for the status without tripping the error handler.
$status = & $pgCtl -D $pgData status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "PostgreSQL is already running on port 5432."
    exit 0
}

& $pgCtl -D $pgData -l $logFile -w start

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "PostgreSQL is running on localhost:5432."
    Write-Host "Log file: $logFile"
} else {
    Write-Error "PostgreSQL failed to start. Check the log: $logFile"
}
