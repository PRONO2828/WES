param(
  [string]$LoginPassword,
  [int]$Port = 4000
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$logsDir = Join-Path $root 'tmp-cloudflare'
$serverWorkingDir = Join-Path $root 'server'
$nodeExe = Join-Path $root 'node-portable\node.exe'
$cloudflaredExe = Join-Path $root 'tools\cloudflared\cloudflared.exe'
$serverOut = Join-Path $logsDir 'wes-fsm-server.out.log'
$serverErr = Join-Path $logsDir 'wes-fsm-server.err.log'
$tunnelOut = Join-Path $logsDir 'cloudflare-tunnel.out.log'
$tunnelErr = Join-Path $logsDir 'cloudflare-tunnel.err.log'
$sessionFile = Join-Path $logsDir 'public-share-session.txt'

function New-RandomHex([int]$ByteCount = 16) {
  $bytes = New-Object byte[] $ByteCount
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $rng.GetBytes($bytes)
  $rng.Dispose()
  return ([System.BitConverter]::ToString($bytes) -replace '-', '').ToLowerInvariant()
}

if (-not $LoginPassword) {
  $LoginPassword = "WES-" + (New-RandomHex 6)
}

$jwtSecret = New-RandomHex 32
New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

if (-not (Test-Path $nodeExe)) {
  throw "Node executable was not found at $nodeExe"
}

if (-not (Test-Path $cloudflaredExe)) {
  throw "cloudflared executable was not found at $cloudflaredExe"
}

$env:PORT = "$Port"
$env:STATIC_ROOT = $root
$env:WES_FSM_LOGIN_PASSWORD = $LoginPassword
$env:JWT_SECRET = $jwtSecret

$serverProcess = Start-Process -FilePath $nodeExe `
  -WorkingDirectory $serverWorkingDir `
  -ArgumentList @('.\src\index.js') `
  -RedirectStandardOutput $serverOut `
  -RedirectStandardError $serverErr `
  -PassThru

$healthUrl = "http://127.0.0.1:$Port/api/health"
$serverReady = $false

for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  try {
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 3
    if ($response.StatusCode -eq 200) {
      $serverReady = $true
      break
    }
  } catch {
    if ($serverProcess.HasExited) {
      throw "WES FSM server exited early. Check $serverErr and $serverOut."
    }
  }
}

if (-not $serverReady) {
  throw "WES FSM server did not become healthy at $healthUrl. Check $serverErr and $serverOut."
}

$tunnelProcess = Start-Process -FilePath $cloudflaredExe `
  -ArgumentList @('tunnel', '--url', "http://localhost:$Port") `
  -RedirectStandardOutput $tunnelOut `
  -RedirectStandardError $tunnelErr `
  -PassThru

$publicUrl = $null

for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 1
  if ($tunnelProcess.HasExited) {
    throw "Cloudflare tunnel exited early. Check $tunnelErr and $tunnelOut."
  }

  $combinedLog =
    @(
      if (Test-Path $tunnelOut) { Get-Content $tunnelOut -Raw }
      if (Test-Path $tunnelErr) { Get-Content $tunnelErr -Raw }
    ) -join "`n"

  $match = [regex]::Match($combinedLog, 'https://[-a-z0-9]+\.trycloudflare\.com')
  if ($match.Success) {
    $publicUrl = $match.Value
    break
  }
}

if (-not $publicUrl) {
  throw "Cloudflare tunnel started but no public URL was captured yet. Check $tunnelOut and $tunnelErr."
}

@"
Public URL: $publicUrl
APK API URL: $publicUrl/api
Login password: $LoginPassword
Server PID: $($serverProcess.Id)
Tunnel PID: $($tunnelProcess.Id)
"@ | Set-Content -Path $sessionFile

Write-Host ""
Write-Host "Public URL: $publicUrl"
Write-Host "APK API URL: $publicUrl/api"
Write-Host "Login password: $LoginPassword"
Write-Host "Server PID: $($serverProcess.Id)"
Write-Host "Tunnel PID: $($tunnelProcess.Id)"
Write-Host "Session file: $sessionFile"
