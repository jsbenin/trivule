import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.',
    server: {
        open: true,
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            // Resolve 'trivule' to the source during development
            'trivule': path.resolve(__dirname, '../../packages/trivule/src'),
        },
    },
});
