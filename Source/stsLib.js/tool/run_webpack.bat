cd /d %~dp0

@REM ƒtƒHƒ‹ƒ_‚ª‚È‚¯‚ê‚Îì‚é
IF NOT EXIST "..\build\" (
  mkdir ..\build
)
webpack --config webpack.config.js
pause

