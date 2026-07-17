@echo off
echo.
echo  Deploying to twimbol.com...
echo.

git add -A
git commit -m "deploy: %date% %time%"
git push origin main
vercel --prod --yes --scope contacttwimbol-4783s-projects

echo.
echo  Done! Live at https://twimbol.com
echo.
