cd /d %~dp0
mkdir .\build
cmd /k browserify -r ./stslib_web.js:stslib_web.js -o ./build/build.js

