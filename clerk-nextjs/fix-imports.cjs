const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components', 'lib'];

// Map of prefixes we want to target for relative import replacement
// We look for anything that starts with some number of ../ and then one of these roots
const mappedRoots = ['components', 'lib', 'contexts', 'utils', 'services', 'types', 'hooks'];

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Regular expression to match relative imports that eventually point to our roots
            // e.g. import { foo } from '../../components/Bar' -> import { foo } from '@/components/Bar'

            mappedRoots.forEach(root => {
                // Regex looks for: from '.../root/' or ".../root/"
                // ((\.\.\/)+|\.\/) matches one or more ../ or a single ./
                const regex = new RegExp(`from\\s+['"](?:\\.\\.\\/)+${root}\\/(.*?)['"]`, 'g');
                content = content.replace(regex, `from '@/${root}/$1'`);

                const regexCurrent = new RegExp(`from\\s+['"]\\.\\/${root}\\/(.*?)['"]`, 'g');
                content = content.replace(regexCurrent, `from '@/${root}/$1'`);

                // Handle path without trailing slash but exact match to the root folder (e.g. from '../../types')
                const regexExact = new RegExp(`from\\s+['"](?:\\.\\.\\/)+${root}['"]`, 'g');
                content = content.replace(regexExact, `from '@/${root}'`);

                const regexCurrentExact = new RegExp(`from\\s+['"]\\.\\/${root}['"]`, 'g');
                content = content.replace(regexCurrentExact, `from '@/${root}'`);
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

console.log('Import refactoring complete.');
