const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

const modelsDir = path.join(__dirname, '../public/models');

// Lire tous les fichiers dans le dossier models
const files = fs.readdirSync(modelsDir);

// Filtrer uniquement les images
const imageFiles = files.filter(file =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
).sort();

console.log('📐 Dimensions des images:\n');

const results = [];

imageFiles.forEach(file => {
    const filePath = path.join(modelsDir, file);
    try {
        // Lire le fichier en buffer
        const buffer = fs.readFileSync(filePath);
        const dimensions = sizeOf(buffer);
        const result = {
            file,
            width: dimensions.width,
            height: dimensions.height,
            ratio: (dimensions.width / dimensions.height).toFixed(2)
        };
        results.push(result);

        console.log(`${file}:`);
        console.log(`  Width: ${dimensions.width}px`);
        console.log(`  Height: ${dimensions.height}px`);
        console.log(`  Ratio: ${result.ratio} (${dimensions.width > dimensions.height ? 'paysage' : 'portrait'})`);
        console.log('');
    } catch (error) {
        console.log(`❌ Erreur pour ${file}: ${error.message}\n`);
    }
});

// Générer le code pour le mock data
console.log('\n📋 Code pour modelsData:\n');
results.forEach((result, index) => {
    const id = index + 1;
    const extension = path.extname(result.file);
    console.log(`    {
        id: ${id},
        image: '/models/${result.file}',
        titre: 'Model ${id}',
        description: 'Description',
        prix: 299.99,
        width: ${result.width},
        height: ${result.height}
    },`);
});
