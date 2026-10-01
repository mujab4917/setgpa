# Stops the local PostgreSQL server started by scripts\start-database.ps1.
#
#   powershell -ExecutionPolicy Bypass -File scripts\stop-database.ps1
#
# You do not have to stop it - closing the terminal leaves it running, and it
# shuts down when you restart the PC. Use this when you want the port back or
# want to be sure the data is flushed to disk.

$ErrorActionPreference = "Stop"

$pgHome = Join-Path $env:LOCALAPPDATA "Programs\pgsql"
$pgData = Join-Path $env:LOCALAPPDATA "Programs\pgsql-data"
$pgCtl = Join-Path $pgHome "bin\pg_ctl.exe"

if (-not (Test-Path $pgCtl)) {
    Write-Error "PostgreSQL binaries not found at $pgHome."
}

$status = & $pgCtl -D $pgData status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "PostgreSQL is not running."
    exit 0
}

# "fast" closes client connections and rolls back open transactions, then
# shuts down cleanly. It is the normal choice for development.
& $pgCtl -D $pgData -m fast -w stop

Write-Host "PostgreSQL stopped."
