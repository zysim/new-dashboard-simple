#!/bin/bash
# exportToPi.sh
# A file to send the compiled files to the PI

CLEAR="\e[39m"
CYAN="\e[96m"
GREEN="\e[92m"


# Compile project
echo -e "$CYAN""Building project...""$CLEAR"
npm run build
echo -e "$GREEN""Build complete!""$CYAN"" Now sending files to out/ ...""$CLEAR"

# Create the out folder if it isn't there already
if [[ ! -d "out" ]]; then
  mkdir "out"
fi

# Overwrite out/ with dist/
cp -TRv dist/ out/dist

# index.html
cat >out/index.html <<EOL
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>new-dashboard-simple</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="dist/build.js"></script>
  </body>
</html>
EOL


echo -e "$GREEN""Prep work all done! Copy-paste the out folder to the Pi""$CLEAR"
