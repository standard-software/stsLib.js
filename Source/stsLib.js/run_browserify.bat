cd /d %~dp0

@REM ƒtƒHƒ‹ƒ_‚ª‚È‚¯‚ê‚Îì‚é
IF NOT EXIST ".\build\" (
  mkdir .\build
)
cmd /k browserify -r ./stslib_web.js:stslib_web.js -o ./build/build-browserify.js

