#!/bin/bash

echo "===================================="
echo "Iniciando Backend do Ecommerce"
echo "===================================="
echo ""

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "[ERRO] Arquivo .env não encontrado!"
    echo "Por favor, crie o arquivo .env baseado no env.example"
    exit 1
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
    echo ""
fi

echo "Iniciando servidor..."
echo ""
npm start

