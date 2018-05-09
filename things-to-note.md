Old system version control:
- Develop locally
- RPi pull all files from remote

New system version control:
- Build app locally
- Push to remote
- RPi pull from remote

Need to find some way for the RPi to only pull the compiled files from remote. Or the repo it pulls from only has the minified files.

Question:
Possibly remote has a branch called prod that only contains the built files.
So upon receipt of a new commit from local:
- Build the files
- Checkout to prod
- Merge specific files to prod