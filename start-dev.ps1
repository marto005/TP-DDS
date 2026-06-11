param(
  [switch]$Seed,
  [switch]$DryRun
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$portableNodeDir = 'C:\Users\marti\AppData\Local\node-v20.20.2'
$npmCmd = 'npm.cmd'

if (Test-Path $portableNodeDir) {
  $env:PATH = "$portableNodeDir;$env:PATH"
  $npmCmd = Join-Path $portableNodeDir 'npm.cmd'
}

$backendDir = Join-Path $repoRoot 'backend-mantenimiento\backend'
$frontendDir = Join-Path $repoRoot 'backend-mantenimiento\frontend'

function Start-DevWindow {
  param(
    [string]$Title,
    [string]$WorkingDir,
    [string]$Command
  )

  if ($DryRun) {
    Write-Host "[$Title] $Command"
    return
  }

  $escapedWorkingDir = $WorkingDir.Replace('"', '``"')
  $escapedCommand = $Command.Replace('"', '``"')
  Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$escapedWorkingDir'; $escapedCommand"
  ) | Out-Null
}

if ($Seed) {
  Start-DevWindow -Title 'backend-seed' -WorkingDir $backendDir -Command "& '$npmCmd' run seed"
}

Start-DevWindow -Title 'backend' -WorkingDir $backendDir -Command "& '$npmCmd' run dev"
Start-DevWindow -Title 'frontend' -WorkingDir $frontendDir -Command "& '$npmCmd' run dev"

if ($DryRun) {
  Write-Host 'Dry run completo.'
} else {
  Write-Host 'Backend y frontend abiertos en nuevas ventanas.'
}