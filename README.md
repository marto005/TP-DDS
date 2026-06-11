# TP DDS

## Arranque rapido

Para abrir backend y frontend en ventanas separadas:

```powershell
cd "C:\Users\marti\Desktop\facu\3er año\DDS\TP-PRE-PARCIAL\TP-DDS"
.\start-dev.cmd
```

Si queres volver a cargar la semilla junto con el arranque:

```powershell
cd "C:\Users\marti\Desktop\facu\3er año\DDS\TP-PRE-PARCIAL\TP-DDS"
.\start-dev.cmd -Seed
```

Para probar el script sin abrir ventanas:

```powershell
cd "C:\Users\marti\Desktop\facu\3er año\DDS\TP-PRE-PARCIAL\TP-DDS"
powershell -NoProfile -ExecutionPolicy Bypass -File .\start-dev.ps1 -DryRun
```
