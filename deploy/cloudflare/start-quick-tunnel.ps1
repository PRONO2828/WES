param(
  [string]$LocalUrl = 'http://localhost:4000'
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$bundledCloudflared = Join-Path $root 'tools\cloudflared\cloudflared.exe'

$cloudflaredPath =
  if (Test-Path $bundledCloudflared) {
    $bundledCloudflared
  } else {
    $cmd = Get-Command cloudflared -ErrorAction SilentlyContinue
    if ($cmd) { $cmd.Source } else { $null }
  }

if (-not $cloudflaredPath) {
  throw "cloudflared is not installed or not on PATH. Install it first, then run this script again."
}

Write-Host "Starting Cloudflare Quick Tunnel to $LocalUrl"
Write-Host "Keep this window open while people are using the app."
& $cloudflaredPath tunnel --url $LocalUrl
