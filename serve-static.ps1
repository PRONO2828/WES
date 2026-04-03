param(
  [int]$Port = 5500,
  [string]$Root = (Split-Path -Parent $MyInvocation.MyCommand.Path),
  [string]$BindAddress = "0.0.0.0"
)

function Get-ContentType([string]$Path) {
  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".css" { return "text/css; charset=utf-8" }
    ".js" { return "application/javascript; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    ".webmanifest" { return "application/manifest+json; charset=utf-8" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".svg" { return "image/svg+xml" }
    ".ico" { return "image/x-icon" }
    default { return "application/octet-stream" }
  }
}

function Write-Response(
  [System.Net.Sockets.NetworkStream]$Stream,
  [string]$Status,
  [string]$ContentType,
  [byte[]]$Body
) {
  $headers = "HTTP/1.1 $Status`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  $Stream.Write($Body, 0, $Body.Length)
  $Stream.Flush()
}

$ipAddress =
  if ($BindAddress -eq "0.0.0.0" -or $BindAddress -eq "*") {
    [System.Net.IPAddress]::Any
  } else {
    [System.Net.IPAddress]::Parse($BindAddress)
  }

$listener = [System.Net.Sockets.TcpListener]::new($ipAddress, $Port)
$listener.Start()

Write-Host "Serving $Root on http://$BindAddress`:$Port/"

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    $stream = $null
    $reader = $null

    try {
      $stream = $client.GetStream()
      $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()

      if ([string]::IsNullOrWhiteSpace($requestLine)) {
        continue
      }

      while ($true) {
        $headerLine = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($headerLine)) {
          break
        }
      }

      $requestParts = $requestLine.Split(" ")
      $rawPath = if ($requestParts.Length -ge 2) { $requestParts[1] } else { "/" }
      $relativePath = [System.Uri]::UnescapeDataString(($rawPath.Split("?")[0]).TrimStart("/"))

      if ([string]::IsNullOrWhiteSpace($relativePath)) {
        $relativePath = "index.html"
      }

      $targetPath = Join-Path $Root $relativePath
      if ((Test-Path $targetPath) -and (Get-Item $targetPath).PSIsContainer) {
        $targetPath = Join-Path $targetPath "index.html"
      }

      if (-not (Test-Path $targetPath -PathType Leaf)) {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        Write-Response -Stream $stream -Status "404 Not Found" -ContentType "text/plain; charset=utf-8" -Body $bytes
        continue
      }

      $body = [System.IO.File]::ReadAllBytes($targetPath)
      $contentType = Get-ContentType $targetPath
      Write-Response -Stream $stream -Status "200 OK" -ContentType $contentType -Body $body
    } catch {
      if ($stream) {
        $message = [System.Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
        Write-Response -Stream $stream -Status "500 Internal Server Error" -ContentType "text/plain; charset=utf-8" -Body $message
      }
    } finally {
      if ($reader) {
        $reader.Dispose()
      }
      if ($stream) {
        $stream.Dispose()
      }
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
