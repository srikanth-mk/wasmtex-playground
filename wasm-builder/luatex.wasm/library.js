mergeInto(LibraryManager.library, {
  kpse_find_file_js: function(nameptr, format, mustexist) {
    return kpse_find_file_impl(nameptr, format, mustexist);
  },
  kpse_find_pk_js: function(nameptr, dpi) {
    return kpse_find_pk_impl(nameptr, dpi);
  },
  // LuaTeX specific functions
  lua_searcher_js: function(nameptr) {
    return lua_searcher_impl(nameptr);
  },
  luatex_callback_js: function(nameptr, argptr) {
    return luatex_callback_impl(nameptr, argptr);
  }
});