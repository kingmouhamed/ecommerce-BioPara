const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components', 'lib'];

const movedPaths = {
    'ProductCard': 'products/ProductCard',
    'EnhancedProductCard': 'products/EnhancedProductCard',
    'ProductList': 'products/ProductList',
    'ProductFilters': 'products/ProductFilters',
    'CategoriesGrid': 'products/CategoriesGrid',
    'Navigation': 'layout/Navigation',
    'BrandLogo': 'layout/BrandLogo',
    'Banner': 'layout/Banner',
    'Breadcrumbs': 'layout/Breadcrumbs',
    'SchemaMarkup': 'layout/SchemaMarkup',
    'Providers': 'layout/Providers',
    'Pagination': 'ui/Pagination',
    'WhatsAppButton': 'ui/WhatsAppButton',
    'ImageWithFallback': 'ui/ImageWithFallback',
    'BackgroundPattern': 'ui/BackgroundPattern'
};

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            Object.entries(movedPaths).forEach(([oldName, newRelPath]) => {
                // Replace `@/components/OldName` with `@/components/NewRelPath`
                const regexAlias = new RegExp(`from\\s+['"]@/components/${oldName}['"]`, 'g');
                content = content.replace(regexAlias, `from '@/components/${newRelPath}'`);

                // Sometimes imports might still be relative and point straight to the old file
                // E.g. `import Foo from '../OldName'` -> we can just blanket replace if it exactly matches the file basename.
                // It's safer to just run the script now because we already converted everything to `@/components/...` with fix-imports.cjs.
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated imports in: ${fullPath}`);
            }
        }
    }
}

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
    }
});

console.log('Component relocation import refactoring complete.');
