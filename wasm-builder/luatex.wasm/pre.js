// Add LuaTeX specific constants
const LUACACHEROOT = "/lua";
const LUAPATH = "/lua/?.lua;/tex/?.lua";

// Enhanced Module setup
Module['preRun'] = function() {
    FS.mkdir(TEXCACHEROOT);
    FS.mkdir(LUACACHEROOT);
    FS.mkdir(WORKROOT);
    
    // Set Lua path
    ENV['LUA_PATH'] = LUAPATH;
};

// LuaTeX compilation routine
function compileLuaLaTeXRoutine() {
    prepareExecutionContext();
    const setMainFunction = cwrap('setMainEntry', 'number', ['string']);
    setMainFunction(self.mainfile);
    let status = _compileLuaLaTeX();
    
    if (status === 0 || status === 1) {
        let pdfArrayBuffer = null;
        try {
            let pdfurl = WORKROOT + "/" + self.mainfile.substr(0, self.mainfile.length - 4) + ".pdf";
            pdfArrayBuffer = FS.readFile(pdfurl, {
                encoding: 'binary'
            });
        } catch (err) {
            console.error("Fetch content failed.");
            status = -253;
            self.postMessage({
                'result': 'failed',
                'status': status,
                'log': self.memlog,
                'cmd': 'compile'
            });
            return;
        }
        self.postMessage({
            'result': 'ok',
            'status': status,
            'log': self.memlog,
            'pdf': pdfArrayBuffer.buffer,
            'cmd': 'compile'
        }, [pdfArrayBuffer.buffer]);
    } else {
        console.error("LuaLaTeX compilation failed, with status code " + status);
        self.postMessage({
            'result': 'failed',
            'status': status,
            'log': self.memlog,
            'cmd': 'compile'
        });
    }
}

// Enhanced message handler
self['onmessage'] = function(ev) {
    let data = ev['data'];
    let cmd = data['cmd'];
    if (cmd === 'compileluatex') {
        compileLuaLaTeXRoutine();
    } else if (cmd === 'compileformat') {
        compileFormatRoutine();
    } else if (cmd === "settexliveurl") {
        setTexliveEndpoint(data['url']);
    } else if (cmd === "mkdir") {
        mkdirRoutine(data['url']);
    } else if (cmd === "writefile") {
        writeFileRoutine(data['url'], data['src']);
    } else if (cmd === "setmainfile") {
        self.mainfile = data['url'];
    } else if (cmd === "grace") {
        console.error("Gracefully Close");
        self.close();
    } else if (cmd === "flushcache") {
        cleanDir(WORKROOT);
    } else {
        console.error("Unknown command " + cmd);
    }
};

// Lua module searcher
function lua_searcher_impl(nameptr) {
    const reqname = UTF8ToString(nameptr);
    
    if (reqname.includes("/")) {
        return 0;
    }

    const cacheKey = "lua/" + reqname + ".lua";
    
    if (cacheKey in texlive404_cache) {
        return 0;
    }

    if (cacheKey in texlive200_cache) {
        const savepath = texlive200_cache[cacheKey];
        return _allocate(intArrayFromString(savepath));
    }

    const remote_url = self.texlive_endpoint + 'luatex/' + cacheKey;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", remote_url, false);
    xhr.timeout = 150000;
    xhr.responseType = "arraybuffer";
    
    try {
        xhr.send();
    } catch (err) {
        console.log("Lua module download failed " + remote_url);
        return 0;
    }

    if (xhr.status === 200) {
        let arraybuffer = xhr.response;
        const fileid = xhr.getResponseHeader('fileid');
        const savepath = LUACACHEROOT + "/" + fileid;
        FS.writeFile(savepath, new Uint8Array(arraybuffer));
        texlive200_cache[cacheKey] = savepath;
        return _allocate(intArrayFromString(savepath));
    } else if (xhr.status === 301) {
        texlive404_cache[cacheKey] = 1;
        return 0;
    }
    return 0;
}