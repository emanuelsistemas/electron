#define MyAppName "Nexo PDV"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Nexo PDV"
#define MyAppURL "https://nexopdv.emasoftware.io/"
#define MyAppExeName "Nexo PDV.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
AppId={{com.nexopdv.app}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DisableProgramGroupPage=yes
OutputBaseFilename=NexoPDV-SingleFile
Compression=lzma2/ultra64
SolidCompression=yes
; Configurações para criar um único arquivo executável
InternalCompressLevel=ultra64
LZMAUseSeparateProcess=yes
LZMADictionarySize=1048576
LZMANumFastBytes=273
SetupIconFile=assets\icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
WizardStyle=modern

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
// Função para verificar se o .NET Framework está instalado
function IsDotNetDetected(): boolean;
begin
  Result := true;
end;

// Função para verificar se o Visual C++ Redistributable está instalado
function IsVCRedistInstalled(): boolean;
begin
  Result := true;
end;

// Verificar requisitos antes da instalação
function InitializeSetup(): Boolean;
begin
  Result := True;
  
  // Verificar se o .NET Framework está instalado
  if not IsDotNetDetected() then
  begin
    MsgBox('O .NET Framework não foi detectado. Por favor, instale-o antes de continuar.', mbError, MB_OK);
    Result := False;
    exit;
  end;
  
  // Verificar se o Visual C++ Redistributable está instalado
  if not IsVCRedistInstalled() then
  begin
    MsgBox('O Visual C++ Redistributable não foi detectado. Por favor, instale-o antes de continuar.', mbError, MB_OK);
    Result := False;
    exit;
  end;
end;