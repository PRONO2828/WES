$root = 'C:\Users\Administrator\Documents\New project 4'
$node = Join-Path $root 'node-portable\node.exe'

$env:PORT = '4001'
Set-Location (Join-Path $root 'server')
& $node '.\src\index.js'
