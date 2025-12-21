import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: '.',
    server: {
        open: true,
    },
	plugins: [tailwindcss()],
    resolve: {
        extensions: ['.ts'],
        alias: {
            // Resolve 'trivule' to the source during development
            'trivule': path.resolve(__dirname, '../../packages/trivule/src'),
        },
    },
});
