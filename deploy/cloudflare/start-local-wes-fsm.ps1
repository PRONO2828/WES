param(
  [int]$Port = 4000,
  [string]$LoginPassword,
  [string]$JwtSecret
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$node = Join-Path $root 'node-portable\node.exe'

function New-HexSecret([int]$ByteCount = 32) {
  $bytes = New-Object byte[] $ByteCount
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $rng.GetBytes($bytes)
  $rng.Dispose()
  return ([System.BitConverter]::ToString($bytes) -replace '-', '').ToLowerInvariant()
}

if (-not (Test-Path $node)) {
  throw "Node executable was not found at $node"
}

$effectiveLoginPassword =
  if ($LoginPassword) {
    $LoginPassword
  } elseif ($env:WES_FSM_LOGIN_PASSWORD) {
    $env:WES_FSM_LOGIN_PASSWORD
  } else {
    throw "Set -LoginPassword or WES_FSM_LOGIN_PASSWORD before starting WES FSM."
  }

$effectiveJwtSecret =
  if ($JwtSecret) {
    $JwtSecret
  } elseif ($env:JWT_SECRET) {
    $env:JWT_SECRET
  } else {
    New-HexSecret 32
  }

$env:PORT = [string]$Port
$env:WES_FSM_LOGIN_PASSWORD = $effectiveLoginPassword
$env:JWT_SECRET = $effectiveJwtSecret
$env:STATIC_ROOT = $root
Set-Location (Join-Path $root 'server')

Write-Host "Starting WES FSM on http://127.0.0.1:$Port/"
& $node '.\src\index.js'
