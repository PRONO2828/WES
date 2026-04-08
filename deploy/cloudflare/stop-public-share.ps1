$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$sessionFile = Join-Path $root 'tmp-cloudflare\public-share-session.txt'

if (-not (Test-Path $sessionFile)) {
  Write-Host "No Cloudflare share session file was found at $sessionFile"
  exit 0
}

$content = Get-Content -Path $sessionFile
$serverPidLine = $content | Where-Object { $_ -like 'Server PID:*' }
$tunnelPidLine = $content | Where-Object { $_ -like 'Tunnel PID:*' }

$serverPid = if ($serverPidLine) { [int]($serverPidLine -replace '^Server PID:\s*', '') } else { $null }
$tunnelPid = if ($tunnelPidLine) { [int]($tunnelPidLine -replace '^Tunnel PID:\s*', '') } else { $null }

foreach ($pid in @($serverPid, $tunnelPid)) {
  if ($pid) {
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($process) {
      Stop-Process -Id $pid -Force
      Write-Host "Stopped process $pid"
    }
  }
}

Remove-Item $sessionFile -Force -ErrorAction SilentlyContinue
Write-Host "Cloudflare share session cleared."
