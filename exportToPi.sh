#!/bin/bash
# exportToPi.sh
# A file to send the compiled files to the PI

CLEAR="\e[39m"
CYAN="\e[96m"
GREEN="\e[92m"


# Compile project if it hasn't been yet
if [[ ! -d "dist" ]]; then
  echo -e "$CYAN" . "Building project..." . "$CLEAR"
  npm run build
  echo -e "$GREEN" . "Build complete!" . "$CYAN" . " Now sending files to out/ ..." . "$CLEAR"
fi

# Create the out folder if it isn't there already
if [[ ! -d "out" ]]; then
  mkdir "out"
fi

# Copy dist/public.js and index.html into out/
cp dist/* index.html out

echo -e "$GREEN" . "Prep work all done! Copy-paste the out folder to the Pi" . "$CLEAR"
