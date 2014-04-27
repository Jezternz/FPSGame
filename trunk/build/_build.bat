
:: This batch is used to fire of a complete build of www-dev & www-release

node "node_modules\grunt-cli\bin\grunt" -gruntfile GruntFile.js default
echo "Press any key to close dialog"
pause