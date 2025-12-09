#!/bin/bash

# Script pour basculer entre mode API et mode Local

MODELS_DIR="app/models"
LOCAL_FILE="page-local.tsx"
API_FILE="page-with-api.tsx"
ACTIVE_FILE="page.tsx"

# Vérifier si nous sommes dans le bon répertoire
if [ ! -d "$MODELS_DIR" ]; then
    echo "❌ Erreur : Le dossier $MODELS_DIR n'existe pas"
    echo "Assurez-vous d'exécuter ce script depuis la racine du projet"
    exit 1
fi

cd "$MODELS_DIR"

# Fonction pour afficher le mode actuel
check_mode() {
    if [ -f "$ACTIVE_FILE" ]; then
        if grep -q "useModels" "$ACTIVE_FILE"; then
            echo "📊 Mode actuel : API"
            return 0
        else
            echo "📊 Mode actuel : Local"
            return 1
        fi
    else
        echo "❌ Aucun fichier page.tsx trouvé"
        exit 1
    fi
}

# Fonction pour basculer vers le mode API
switch_to_api() {
    echo "🔄 Basculement vers le mode API..."
    
    if [ -f "$ACTIVE_FILE" ]; then
        mv "$ACTIVE_FILE" "$LOCAL_FILE"
        echo "✅ Sauvegarde de la version locale : $LOCAL_FILE"
    fi
    
    if [ -f "$API_FILE" ]; then
        mv "$API_FILE" "$ACTIVE_FILE"
        echo "✅ Activation de la version API"
        echo "🌐 Mode API activé !"
        echo ""
        echo "⚠️  N'oubliez pas :"
        echo "   1. Installer : npm install @supabase/supabase-js"
        echo "   2. Configurer : .env.local avec votre SUPABASE_ANON_KEY"
        echo "   3. Redémarrer : npm run dev"
    else
        echo "❌ Erreur : $API_FILE introuvable"
        exit 1
    fi
}

# Fonction pour basculer vers le mode Local
switch_to_local() {
    echo "🔄 Basculement vers le mode Local..."
    
    if [ -f "$ACTIVE_FILE" ]; then
        mv "$ACTIVE_FILE" "$API_FILE"
        echo "✅ Sauvegarde de la version API : $API_FILE"
    fi
    
    if [ -f "$LOCAL_FILE" ]; then
        mv "$LOCAL_FILE" "$ACTIVE_FILE"
        echo "✅ Activation de la version locale"
        echo "💾 Mode Local activé !"
    else
        echo "❌ Erreur : $LOCAL_FILE introuvable"
        exit 1
    fi
}

# Menu principal
echo "🔧 Script de basculement Mode API / Local"
echo "=========================================="
echo ""
check_mode
current_mode=$?
echo ""
echo "Que voulez-vous faire ?"
echo "  1) Basculer vers le mode API"
echo "  2) Basculer vers le mode Local"
echo "  3) Annuler"
echo ""
read -p "Votre choix (1-3) : " choice

case $choice in
    1)
        if [ $current_mode -eq 0 ]; then
            echo "ℹ️  Vous êtes déjà en mode API"
        else
            switch_to_api
        fi
        ;;
    2)
        if [ $current_mode -eq 1 ]; then
            echo "ℹ️  Vous êtes déjà en mode Local"
        else
            switch_to_local
        fi
        ;;
    3)
        echo "❌ Opération annulée"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
