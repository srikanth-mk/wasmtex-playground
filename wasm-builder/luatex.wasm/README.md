LuaTeX WASM Build Guide
Key Differences from pdfTeX
LuaTeX has several additional components compared to pdfTeX:

Lua interpreter (5.3+ embedded)
LuaJIT (optional, but common)
Additional libraries: socket, lfs, md5, etc.
Different source structure
More complex build system

Required Files Structure
luatex-wasm/
├── main.c                    # Main entry point (adapted)
├── library.js               # JS library functions
├── pre.js                    # Pre-run setup
├── Makefile                  # Build configuration
├── LuaTeXEngine.js          # TypeScript/JS wrapper
├── luatex/                  # LuaTeX source code
│   ├── source/
│   │   ├── texk/web2c/luatexdir/
│   │   ├── libs/lua53/
│   │   └── libs/luajit/
├── kpathsea/                # Path searching library
└── build/                   # Build output directory