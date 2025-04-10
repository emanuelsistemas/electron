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
; Comentando a linha do ícone personalizado, pois o arquivo .ico não existe
; SetupIconFile=assets\icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
WizardStyle=modern

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Arquivos principais do aplicativo
Source: "src\*"; DestDir: "{app}\src"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "assets\*"; DestDir: "{app}\assets"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "config.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "node_modules\*"; DestDir: "{app}\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs

; Todos os arquivos do Electron
Source: "node_modules\electron\dist\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; Renomear electron.exe para o nome do aplicativo
Source: "node_modules\electron\dist\electron.exe"; DestDir: "{app}"; DestName: "{#MyAppExeName}"; Flags: ignoreversion
; Arquivo de inicialização
Source: "start-app.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\start-app.bat"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\start-app.bat"; Tasks: desktopicon

[Run]
Filename: "{app}\start-app.bat"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

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