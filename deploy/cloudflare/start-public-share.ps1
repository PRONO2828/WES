param(
  [string]$LoginPassword,
  [int]$Port = 4000
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$logsDir = Join-Path $root 'tmp-cloudflare'
$serverWorkingDir = Join-Path $root 'server'
$serverScript = Join-Path $PSScriptRoot 'start-local-wes-fsm.ps1'
$portableNode = Join-Path $root 'node-portable\node.exe'
$systemNode = 'C:\Program Files\nodejs\node.exe'
$nodeExe =
  if (Test-Path $systemNode) {
    $systemNode
  } elseif (Test-Path $portableNode) {
    $portableNode
  } else {
    $null
  }
$cloudflaredExe = Join-Path $root 'tools\cloudflared\cloudflared.exe'
$powershellExe = Join-Path $PSHOME 'powershell.exe'
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

function Repair-ProcessPathEnvironment {
  $processEnv = [System.Environment]::GetEnvironmentVariables('Process')
  $pathValue = $processEnv['Path']

  if (-not $pathValue) {
    $pathValue = $processEnv['PATH']
  }

  if ($pathValue) {
    [System.Environment]::SetEnvironmentVariable('Path', $pathValue, 'Process')
  }

  [System.Environment]::SetEnvironmentVariable('PATH', $null, 'Process')
}

function Write-MobileRuntimeConfig([string]$ApiBaseUrl) {
  $payload = [ordered]@{
    apiBaseUrl = $ApiBaseUrl
    updatedAt = (Get-Date).ToUniversalTime().ToString('o')
  } | ConvertTo-Json

  $runtimeFiles = @(
    (Join-Path $root 'client\public\mobile-runtime.json'),
    (Join-Path $root 'client\android\app\src\main\assets\public\mobile-runtime.json'),
    (Join-Path $root 'mobile-runtime.json')
  )

  foreach ($file in $runtimeFiles) {
    $parent = Split-Path -Parent $file
    if ($parent -and -not (Test-Path $parent)) {
      New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }

    Set-Content -Path $file -Value $payload
  }
}

function Publish-MobileRuntimeConfig([string]$ApiBaseUrl) {
  Write-MobileRuntimeConfig -ApiBaseUrl $ApiBaseUrl

  $gitCommand = Get-Command git -ErrorAction SilentlyContinue
  if (-not $gitCommand) {
    return "Runtime config saved locally. Git is not available for GitHub publish."
  }

  $runtimeFile = 'client/public/mobile-runtime.json'

  Push-Location $root
  try {
    $alreadyStaged = @(& $gitCommand.Source diff --cached --name-only) | Where-Object { $_ }
    $otherStaged = $alreadyStaged | Where-Object { $_ -ne $runtimeFile }
    if ($otherStaged.Count -gt 0) {
      return "Runtime config saved locally. GitHub publish skipped because other files are already staged."
    }

    & $gitCommand.Source add -- $runtimeFile | Out-Null

    $hasRuntimeChange = @(& $gitCommand.Source diff --cached --name-only -- $runtimeFile) | Where-Object { $_ }
    if (-not $hasRuntimeChange) {
      return "Runtime config saved locally. GitHub already has the current tunnel URL."
    }

    & $gitCommand.Source commit -m 'Update mobile runtime config' -- $runtimeFile | Out-Null
    & $gitCommand.Source push origin main | Out-Null
    return "Runtime config published to GitHub."
  } catch {
    return "Runtime config saved locally. GitHub publish failed: $($_.Exception.Message)"
  } finally {
    Pop-Location
  }
}

$jwtSecret = New-RandomHex 32
New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

if (-not $nodeExe) {
  throw "Node executable was not found at $nodeExe"
}

if (-not (Test-Path $cloudflaredExe)) {
  throw "cloudflared executable was not found at $cloudflaredExe"
}

if (-not (Test-Path $serverScript)) {
  throw "WES FSM server script was not found at $serverScript"
}

$env:PORT = "$Port"
$env:STATIC_ROOT = $root
if ($LoginPassword) {
  $env:WES_FSM_LOGIN_PASSWORD = $LoginPassword
} else {
  Remove-Item Env:WES_FSM_LOGIN_PASSWORD -ErrorAction SilentlyContinue
}
$env:JWT_SECRET = $jwtSecret
Repair-ProcessPathEnvironment

$serverProcess = Start-Process -FilePath $powershellExe `
  -WorkingDirectory $serverWorkingDir `
  -ArgumentList "-ExecutionPolicy Bypass -File `"$serverScript`" -Port $Port -LoginPassword `"$LoginPassword`" -JwtSecret `"$jwtSecret`"" `
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

$runtimeConfigStatus = Publish-MobileRuntimeConfig -ApiBaseUrl "$publicUrl/api"

if ($LoginPassword) {
  $authSummary = "Fallback login password: $LoginPassword"
} else {
  $authSummary = "Auth Mode: Admin shared password plus technician-specific passwords loaded from the database"
}

@"
Public URL: $publicUrl
APK API URL: $publicUrl/api
$runtimeConfigStatus
$authSummary
Server PID: $($serverProcess.Id)
Tunnel PID: $($tunnelProcess.Id)
"@ | Set-Content -Path $sessionFile

Write-Host ""
Write-Host "Public URL: $publicUrl"
Write-Host "APK API URL: $publicUrl/api"
Write-Host $runtimeConfigStatus
Write-Host $authSummary
Write-Host "Server PID: $($serverProcess.Id)"
Write-Host "Tunnel PID: $($tunnelProcess.Id)"
Write-Host "Session file: $sessionFile"
