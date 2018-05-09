#!/bin/bash
# exportToPi.sh
# A file to send the compiled files to the PI

CLEAR="\033[0m"
CYAN="\033[1;96m"
GREEN="\033[1;92m"

# Compile project
echo -e "${CYAN}Building project...${CLEAR}"
npm run build
echo -e "${GREEN}Build complete!${CYAN} Now sending files to out/ ...${CLEAR}"

# Create the out folder if it isn't there already
if [[ ! -d "out" ]]; then
  mkdir "out"
fi

# Overwrite out/ with dist/
cp -rv dist/ out/dist

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


echo -e "${GREEN}Prep work all done! Now SCP-ing to the Pi${CLEAR}"

scp -r out/* pi@192.168.12.1:sailing-robot/dashboard/new-src && clear
