@echo off
echo 🔍 Running security check...
echo.

REM Simple security check for Windows
findstr /R /I /S "AIzaSy" *.js *.html *.css *.json *.md *.txt *.yml *.yaml 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚨 POTENTIAL FIREBASE API KEYS DETECTED!
    echo Please check the files above for exposed API keys.
    echo.
    echo ⚠️  Do not commit files with API keys!
    echo 💡 Consider using environment variables or external config files.
    echo 📖 See SECURITY_GUIDE.md for best practices.
    exit /b 1
)

findstr /R /I /S "sk-[A-Za-z0-9]" *.js *.html *.css *.json *.md *.txt *.yml *.yaml 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚨 POTENTIAL API KEYS DETECTED!
    echo Please check the files above for exposed secrets.
    exit /b 1
)

findstr /R /I /S "password.*=" *.js *.html *.css *.json *.md *.txt *.yml *.yaml 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚨 POTENTIAL PASSWORDS DETECTED!
    echo Please check the files above for hardcoded passwords.
    exit /b 1
)

echo ✅ No obvious secrets detected.
echo 🛡️  Your code appears to be secure for commit.
echo.
echo 💡 Remember to:
echo - Never commit API keys or passwords
echo - Use environment variables for production
echo - Use external config files for development
echo - Always review files before committing
