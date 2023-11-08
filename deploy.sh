# This script was made executable with: chmod 755 deploy.sh
# Run it as: ./deploy.sh "My commit message"
MSG=$1
git add .
git commit -m "$MSG"
git push remote master


# Notes:

# portfolio-dist contains .git folder and is linked to GitHub via github remote.
# the "github" remote was deleted. Use "origin".