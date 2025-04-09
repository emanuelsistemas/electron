!macro customInstall
  ; Configurações para criar um único arquivo executável
  SetCompress auto
  SetCompressor /SOLID lzma
  SetCompressorDictSize 64
  SetDatablockOptimize on
!macroend

!macro customUnInstall
  ; Limpar completamente após a desinstalação
  RMDir /r "$INSTDIR"
!macroend