/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config)

import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        /* for example, use global to avoid globals imports (describe, test, expect): */
        // globals: true,
    },
    resolve: {
        alias: [
            //为了兼容@import 已“~”为前缀的文件路径
            { find: /^~/, replacement: "" },
        ],
    },
})
