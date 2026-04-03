param(
  [string]$Url = "http://127.0.0.1:5173/",
  [string]$OutputDir = "C:\Users\Administrator\Documents\New project 4\presentation\assets",
  [string]$EdgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  [int]$DebugPort = 9222
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$WorkspaceLoginPassword = $env:WES_FSM_LOGIN_PASSWORD

if (-not $WorkspaceLoginPassword) {
  throw "Set WES_FSM_LOGIN_PASSWORD before running this capture script."
}

function Ensure-Directory {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Receive-CdpMessage {
  param([System.Net.WebSockets.ClientWebSocket]$Socket)

  $buffer = New-Object byte[] 65536
  $segment = [System.ArraySegment[byte]]::new($buffer)
  $stream = New-Object System.IO.MemoryStream

  try {
    do {
      $result = $Socket.ReceiveAsync($segment, [System.Threading.CancellationToken]::None).GetAwaiter().GetResult()
      if ($result.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
        throw "CDP socket closed unexpectedly."
      }
      $stream.Write($buffer, 0, $result.Count)
    } while (-not $result.EndOfMessage)

    return [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
  } finally {
    $stream.Dispose()
  }
}

function New-CdpSession {
  param([string]$WebSocketUrl)

  $socket = [System.Net.WebSockets.ClientWebSocket]::new()
  $socket.ConnectAsync([Uri]$WebSocketUrl, [System.Threading.CancellationToken]::None).GetAwaiter().GetResult()

  $nextId = 0
  return @{
    Socket = $socket
    Invoke = {
      param([string]$Method, [hashtable]$Params = @{})

      $script:nextId += 1
      $messageId = $script:nextId
      $payload = @{
        id = $messageId
        method = $Method
        params = $Params
      } | ConvertTo-Json -Compress -Depth 50

      $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
      $segment = [System.ArraySegment[byte]]::new($bytes)
      $socket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).GetAwaiter().GetResult()

      while ($true) {
        $raw = Receive-CdpMessage -Socket $socket
        $response = $raw | ConvertFrom-Json -Depth 50
        if ($response.PSObject.Properties.Name -contains "id" -and $response.id -eq $messageId) {
          return $response
        }
      }
    }
  }
}

function Invoke-Cdp {
  param(
    [hashtable]$Session,
    [string]$Method,
    [hashtable]$Params = @{}
  )

  return & $Session.Invoke $Method $Params
}

function Invoke-Js {
  param(
    [hashtable]$Session,
    [string]$Expression
  )

  $response = Invoke-Cdp -Session $Session -Method "Runtime.evaluate" -Params @{
    expression = $Expression
    returnByValue = $true
    awaitPromise = $true
  }

  if ($response.PSObject.Properties.Name -contains "exceptionDetails") {
    throw "JavaScript evaluation failed: $Expression"
  }

  return $response.result.result.value
}

function Wait-ForExpression {
  param(
    [hashtable]$Session,
    [string]$Expression,
    [int]$TimeoutSeconds = 20,
    [string]$ErrorMessage = "Timed out waiting for browser state."
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $value = Invoke-Js -Session $Session -Expression $Expression
      if ($value) {
        return $true
      }
    } catch {}
    Start-Sleep -Milliseconds 300
  }

  throw $ErrorMessage
}

function Set-Viewport {
  param(
    [hashtable]$Session,
    [int]$Width,
    [int]$Height,
    [bool]$Mobile = $false,
    [double]$ScaleFactor = 1
  )

  Invoke-Cdp -Session $Session -Method "Emulation.setDeviceMetricsOverride" -Params @{
    width = $Width
    height = $Height
    deviceScaleFactor = $ScaleFactor
    mobile = $Mobile
  } | Out-Null
}

function Save-Screenshot {
  param(
    [hashtable]$Session,
    [string]$Path
  )

  $response = Invoke-Cdp -Session $Session -Method "Page.captureScreenshot" -Params @{
    format = "png"
    captureBeyondViewport = $true
    fromSurface = $true
  }

  [System.IO.File]::WriteAllBytes($Path, [Convert]::FromBase64String($response.result.data))
}

function Click-TextElement {
  param(
    [hashtable]$Session,
    [string]$Text,
    [string]$Selector = "button, a, [role='button']"
  )

  $quotedSelector = $Selector.Replace("\", "\\").Replace("'", "\'")
  $quotedText = $Text.Replace("\", "\\").Replace("'", "\'")
  $script = @"
(() => {
  const wanted = '$quotedText'.toLowerCase();
  const nodes = Array.from(document.querySelectorAll('$quotedSelector'));
  const match = nodes.find((node) => (node.innerText || node.textContent || '').trim().toLowerCase().includes(wanted));
  if (!match) return false;
  match.scrollIntoView({ behavior: 'instant', block: 'center' });
  match.click();
  return true;
})()
"@
  return [bool](Invoke-Js -Session $Session -Expression $script)
}

function Set-InputValue {
  param(
    [hashtable]$Session,
    [string]$Selector,
    [string]$Value
  )

  $quotedSelector = $Selector.Replace("\", "\\").Replace("'", "\'")
  $jsonValue = $Value | ConvertTo-Json -Compress
  $script = @"
(() => {
  const element = document.querySelector('$quotedSelector');
  if (!element) return false;
  const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
  if (descriptor && descriptor.set) {
    descriptor.set.call(element, $jsonValue);
  } else {
    element.value = $jsonValue;
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
})()
"@
  return [bool](Invoke-Js -Session $Session -Expression $script)
}

function Set-SelectByText {
  param(
    [hashtable]$Session,
    [string]$Selector,
    [string]$Text
  )

  $quotedSelector = $Selector.Replace("\", "\\").Replace("'", "\'")
  $quotedText = $Text.Replace("\", "\\").Replace("'", "\'")
  $script = @"
(() => {
  const select = document.querySelector('$quotedSelector');
  if (!select) return false;
  const wanted = '$quotedText'.toLowerCase();
  const option = Array.from(select.options).find((entry) => (entry.textContent || '').toLowerCase().includes(wanted));
  if (!option) return false;
  select.value = option.value;
  select.dispatchEvent(new Event('input', { bubbles: true }));
  select.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
})()
"@
  return [bool](Invoke-Js -Session $Session -Expression $script)
}

function Scroll-ToText {
  param(
    [hashtable]$Session,
    [string]$Text
  )

  $quotedText = $Text.Replace("\", "\\").Replace("'", "\'")
  $script = @"
(() => {
  const wanted = '$quotedText'.toLowerCase();
  const nodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, div, section, article, label, span, button'));
  const match = nodes.find((node) => (node.innerText || node.textContent || '').trim().toLowerCase().includes(wanted));
  if (!match) return false;
  match.scrollIntoView({ behavior: 'instant', block: 'start' });
  window.scrollBy(0, -24);
  return true;
})()
"@
  return [bool](Invoke-Js -Session $Session -Expression $script)
}

Ensure-Directory -Path $OutputDir

$userDataDir = Join-Path $OutputDir ".edge-profile"
Ensure-Directory -Path $userDataDir

if (-not (Test-Path $EdgePath)) {
  throw "Microsoft Edge was not found at $EdgePath"
}

$existingEdge = Get-Process msedge -ErrorAction SilentlyContinue
foreach ($process in $existingEdge) {
  if ($process.Path -eq $EdgePath) {
    continue
  }
}

$edgeArgs = @(
  "--headless=new"
  "--disable-gpu"
  "--no-first-run"
  "--no-default-browser-check"
  "--remote-debugging-port=$DebugPort"
  "--user-data-dir=$userDataDir"
  "--window-size=1600,1400"
  $Url
)

$edgeProcess = Start-Process -FilePath $EdgePath -ArgumentList $edgeArgs -PassThru

try {
  $target = $null
  $deadline = (Get-Date).AddSeconds(20)
  while ((Get-Date) -lt $deadline) {
    try {
      $targets = Invoke-RestMethod -Uri "http://127.0.0.1:$DebugPort/json/list" -TimeoutSec 3
      $target = $targets | Where-Object { $_.type -eq "page" -and $_.url -like "$Url*" } | Select-Object -First 1
      if ($target) {
        break
      }
    } catch {}
    Start-Sleep -Milliseconds 500
  }

  if (-not $target) {
    throw "Could not connect to Edge remote debugging target."
  }

  $session = New-CdpSession -WebSocketUrl $target.webSocketDebuggerUrl
  Invoke-Cdp -Session $session -Method "Page.enable" | Out-Null
  Invoke-Cdp -Session $session -Method "Runtime.enable" | Out-Null
  Invoke-Cdp -Session $session -Method "Network.enable" | Out-Null

  Wait-ForExpression -Session $session -Expression "document.readyState === 'complete'" -TimeoutSeconds 20 -ErrorMessage "The WES app did not finish loading."
  Wait-ForExpression -Session $session -Expression "!!document.querySelector('select[name=\"identity\"]')" -TimeoutSeconds 20 -ErrorMessage "The login screen did not appear."

  Set-Viewport -Session $session -Width 1600 -Height 1400 -Mobile:$false -ScaleFactor 1
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "01-login.png")

  Set-SelectByText -Session $session -Selector "select[name='identity']" -Text "Sang Nicholas" | Out-Null
  Set-InputValue -Session $session -Selector "input[name='password']" -Value $WorkspaceLoginPassword | Out-Null
  Click-TextElement -Session $session -Text "Login To Workspace" | Out-Null
  Wait-ForExpression -Session $session -Expression "Array.from(document.querySelectorAll('button')).some((node) => (node.innerText || node.textContent || '').includes('Logout'))" -TimeoutSeconds 20 -ErrorMessage "Admin login did not complete."
  Start-Sleep -Milliseconds 800

  Set-Viewport -Session $session -Width 1600 -Height 1400 -Mobile:$false -ScaleFactor 1
  Invoke-Js -Session $session -Expression "window.scrollTo(0, 0); true" | Out-Null
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "02-admin-dashboard.png")

  Click-TextElement -Session $session -Text "Jobs" | Out-Null
  Wait-ForExpression -Session $session -Expression "document.body.innerText.includes('Attached Site Report History') || document.body.innerText.includes('Create Job')" -TimeoutSeconds 15 -ErrorMessage "Jobs workspace did not open."
  Start-Sleep -Milliseconds 700
  Scroll-ToText -Session $session -Text "Attached Site Report History" | Out-Null
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "03-admin-repeat-site.png")

  Invoke-Js -Session $session -Expression "window.scrollTo(0, 0); true" | Out-Null
  Click-TextElement -Session $session -Text "Approvals" | Out-Null
  Wait-ForExpression -Session $session -Expression "document.body.innerText.includes('Review Queue') || document.body.innerText.includes('Approve Report')" -TimeoutSeconds 15 -ErrorMessage "Approvals workspace did not open."
  Start-Sleep -Milliseconds 700
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "04-admin-approvals.png")

  Click-TextElement -Session $session -Text "Forum" | Out-Null
  Wait-ForExpression -Session $session -Expression "document.body.innerText.includes('Discussion Forum') || document.body.innerText.includes('Online Users')" -TimeoutSeconds 15 -ErrorMessage "Forum workspace did not open."
  Start-Sleep -Milliseconds 700
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "05-team-forum.png")

  Click-TextElement -Session $session -Text "Logout" | Out-Null
  Wait-ForExpression -Session $session -Expression "!!document.querySelector('select[name=\"identity\"]')" -TimeoutSeconds 20 -ErrorMessage "Logout did not return to login."

  Set-SelectByText -Session $session -Selector "select[name='identity']" -Text "Lewis" | Out-Null
  Set-InputValue -Session $session -Selector "input[name='password']" -Value $WorkspaceLoginPassword | Out-Null
  Click-TextElement -Session $session -Text "Login To Workspace" | Out-Null
  Wait-ForExpression -Session $session -Expression "Array.from(document.querySelectorAll('button')).some((node) => (node.innerText || node.textContent || '').includes('Logout'))" -TimeoutSeconds 20 -ErrorMessage "Technician login did not complete."
  Start-Sleep -Milliseconds 800

  Click-TextElement -Session $session -Text "Jobs" | Out-Null
  Wait-ForExpression -Session $session -Expression "document.body.innerText.includes('Pending') && document.body.innerText.includes('In Progress') && document.body.innerText.includes('Completed')" -TimeoutSeconds 15 -ErrorMessage "Technician jobs board did not open."
  Start-Sleep -Milliseconds 700
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "06-technician-jobs.png")

  Click-TextElement -Session $session -Text "Reports" | Out-Null
  Wait-ForExpression -Session $session -Expression "document.body.innerText.includes('Field Report') || document.body.innerText.includes('Attached Site Reports')" -TimeoutSeconds 15 -ErrorMessage "Technician report view did not open."
  Start-Sleep -Milliseconds 700
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "07-technician-reports.png")

  Set-Viewport -Session $session -Width 430 -Height 932 -Mobile:$true -ScaleFactor 2
  Invoke-Js -Session $session -Expression "window.scrollTo(0, 0); true" | Out-Null
  Start-Sleep -Milliseconds 800
  Save-Screenshot -Session $session -Path (Join-Path $OutputDir "08-mobile-view.png")

  Invoke-Cdp -Session $session -Method "Browser.close" | Out-Null
} finally {
  if ($edgeProcess -and -not $edgeProcess.HasExited) {
    $edgeProcess | Stop-Process -Force
  }
}
