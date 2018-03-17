#!/bin/bash
# exportToPi.sh
# A file to send the compiled files to the PI

# Compile project if it hasn't been yet
if [[ ! -d "dist" ]]; then
  echo "Compiling project..."
  npm run build
fi

# Create the out folder if it isn't there already
if [[ ! -d "out" ]]; then
  mkdir "out"
fi

# Copy dist/public.js and index.html into out/
cp dist/* index.html out
