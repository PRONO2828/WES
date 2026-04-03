param(
  [string]$Url = "http://127.0.0.1:5173/presentation/wes-management-presentation.html",
  [string]$OutputPath = "C:\Users\Administrator\Documents\New project 4\presentation\WES-Executive-Presentation.pdf",
  [int]$Port = 9222
)

$ErrorActionPreference = "Stop"

$edgeExe = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$userDataDir = Join-Path $PSScriptRoot "pdf-profile"
New-Item -ItemType Directory -Force -Path $userDataDir | Out-Null

$edge = Start-Process -FilePath $edgeExe -ArgumentList @(
  "--headless=new",
  "--disable-gpu",
  "--remote-debugging-port=$Port",
  "--user-data-dir=$userDataDir",
  "about:blank"
) -PassThru

$script:nextId = 0
$token = [System.Threading.CancellationToken]::None
$ws = $null

function Receive-CdpJson {
  $buffer = New-Object byte[] 16384
  $stream = New-Object System.IO.MemoryStream
  try {
    while ($true) {
      $segment = [ArraySegment[byte]]::new($buffer)
      $result = $ws.ReceiveAsync($segment, $token).GetAwaiter().GetResult()
      if ($result.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
        throw "DevTools socket closed before PDF export completed."
      }
      $stream.Write($buffer, 0, $result.Count)
      if ($result.EndOfMessage) {
        break
      }
    }
    return [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
  }
  finally {
    $stream.Dispose()
  }
}

function Invoke-Cdp {
  param(
    [string]$Method,
    [hashtable]$Params = @{}
  )

  $script:nextId++
  $requestId = $script:nextId
  $payload = @{
    id = $requestId
    method = $Method
    params = $Params
  } | ConvertTo-Json -Compress -Depth 100

  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
  $segment = [ArraySegment[byte]]::new($bytes)
  $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $token).GetAwaiter().GetResult()

  while ($true) {
    $messageText = Receive-CdpJson
    if ([string]::IsNullOrWhiteSpace($messageText)) {
      continue
    }
    $message = $messageText | ConvertFrom-Json -Depth 100
    if ($message.id -ne $requestId) {
      continue
    }
    if ($message.error) {
      throw "CDP $Method failed: $($message.error.message)"
    }
    return $message.result
  }
}

try {
  $version = $null
  for ($i = 0; $i -lt 40 -and -not $version; $i++) {
    try {
      $version = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version"
    }
    catch {
      Start-Sleep -Milliseconds 250
    }
  }

  if (-not $version) {
    throw "Edge remote debugging did not start."
  }

  $target = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list" |
    Where-Object { $_.type -eq "page" } |
    Select-Object -First 1

  if (-not $target.webSocketDebuggerUrl) {
    throw "No debuggable page target was found."
  }

  $ws = [System.Net.WebSockets.ClientWebSocket]::new()
  $ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, $token).GetAwaiter().GetResult()

  Invoke-Cdp -Method "Page.enable" | Out-Null
  Invoke-Cdp -Method "Runtime.enable" | Out-Null
  Invoke-Cdp -Method "Emulation.setEmulatedMedia" -Params @{
    media = "print"
  } | Out-Null
  Invoke-Cdp -Method "Page.navigate" -Params @{
    url = $Url
  } | Out-Null

  for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Milliseconds 250
    $readyState = Invoke-Cdp -Method "Runtime.evaluate" -Params @{
      expression = "document.readyState"
      returnByValue = $true
    }
    $imagesReady = Invoke-Cdp -Method "Runtime.evaluate" -Params @{
      expression = "Array.from(document.images).every((img) => img.complete)"
      returnByValue = $true
    }

    if ($readyState.result.value -eq "complete" -and $imagesReady.result.value) {
      break
    }
  }

  Start-Sleep -Seconds 1

  $pdf = Invoke-Cdp -Method "Page.printToPDF" -Params @{
    printBackground = $true
    preferCSSPageSize = $true
    displayHeaderFooter = $false
    landscape = $true
    marginTop = 0
    marginBottom = 0
    marginLeft = 0
    marginRight = 0
  }

  [System.IO.File]::WriteAllBytes($OutputPath, [System.Convert]::FromBase64String($pdf.data))
  Write-Output $OutputPath
}
finally {
  if ($ws) {
    if ($ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
      $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", $token).GetAwaiter().GetResult()
    }
    $ws.Dispose()
  }

  if ($edge -and -not $edge.HasExited) {
    Stop-Process -Id $edge.Id -Force
  }
}
