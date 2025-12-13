@echo off
echo ====================================
echo Iniciando Backend do Ecommerce
echo ====================================
echo.

REM Verificar se o arquivo .env existe
if not exist .env (
    echo [ERRO] Arquivo .env nao encontrado!
    echo Por favor, crie o arquivo .env baseado no env.example
    pause
    exit /b 1
)

REM Verificar se node_modules existe
if not exist node_modules (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando servidor...
echo.
npm start

pause

