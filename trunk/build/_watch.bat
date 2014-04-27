
:: This batch is used for development, It:
:: watches for changes to JS, CSS and HTML files. These will be resassembled into www-dev when changes to files are made.
:: hosts a basic webserver that is configured to livereload on changes to the dev build. (http://localhost:8080/index.htm)

node "node_modules\grunt-cli\bin\grunt" -gruntfile GruntFile.js devwatch
echo "Press any key to close dialog"
pause