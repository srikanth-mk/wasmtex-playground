#define EXTERN /* Instantiate data from luatexd.h here.  */

#include <luatexd.h>
#include <lua.h>
#include <lauxlib.h>
#include <lualib.h>

// LuaTeX specific globals
lua_State *Luas = NULL;
string luaname = NULL;
boolean lua_only = false;
boolean lua_use_callback = true;

// LuaTeX banner
const char *luatexbanner = " (neoLuaTeX 1.0.0)";
const char *DEFAULT_FMT_NAME = " neoluatex.fmt";
const char *DEFAULT_DUMP_NAME = "neoluatex";

// Initialize Lua state
void init_lua_state(void) {
    if (Luas == NULL) {
        Luas = luaL_newstate();
        luaL_openlibs(Luas);
        // Register LuaTeX specific functions
        luatex_open_libraries(Luas);
    }
}

// LuaTeX specific main entry
#ifdef WEBASSEMBLY_BUILD
int compileLuaLaTeX() {
    if (strlen(main_entry_file) == 0) {
        return -1;
    }
    strncpy(bootstrapcmd, main_entry_file, MAXMAINFILENAME);
    bootstrapcmd[MAXMAINFILENAME - 1] = 0;
    
    init_lua_state();
    return _compile();
}

int compileLuaFormat() {
    iniversion = 1;
    strncpy(bootstrapcmd, "*lualatex.ini", MAXMAINFILENAME);
    init_lua_state();
    return _compile();
}
#endif