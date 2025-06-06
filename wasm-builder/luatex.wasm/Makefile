PROJECT_NAME	:=	neoluatex.js

CC          	= 	emcc
CXX          	= 	em++
CFLAGS       	= 	-O3 \
					-s USE_ZLIB=1 -s USE_LIBPNG=1 \
					-Wno-parentheses-equality -Wno-pointer-sign \
					-fno-rtti -fno-exceptions \
					-DWEBASSEMBLY_BUILD \
					-DLUATEX_BUILD \
					-I./luatex/source/texk/web2c \
					-I./luatex/source/texk/web2c/luatexdir \
					-I./luatex/source/libs/lua53 \
					-I./kpathsea

CXX_LINK     	= 	$(CXX) -o $@ $(CFLAGS)

# LuaTeX core sources
LUATEX_SOURCES  = 	luatex/source/texk/web2c/luatexdir/luatex.c \
					luatex/source/texk/web2c/luatexdir/lua/luanode.c \
					luatex/source/texk/web2c/luatexdir/lua/luatoken.c \
					luatex/source/texk/web2c/luatexdir/lua/luastuff.c \
					luatex/source/texk/web2c/luatexdir/tex/texnodes.c \
					luatex/source/texk/web2c/luatexdir/tex/texmath.c \
					luatex/source/texk/web2c/luatexdir/tex/directions.c

# Lua 5.3 sources
LUA_SOURCES     = 	luatex/source/libs/lua53/lapi.c \
					luatex/source/libs/lua53/lcode.c \
					luatex/source/libs/lua53/lctype.c \
					luatex/source/libs/lua53/ldebug.c \
					luatex/source/libs/lua53/ldo.c \
					luatex/source/libs/lua53/ldump.c \
					luatex/source/libs/lua53/lfunc.c \
					luatex/source/libs/lua53/lgc.c \
					luatex/source/libs/lua53/llex.c \
					luatex/source/libs/lua53/lmem.c \
					luatex/source/libs/lua53/lobject.c \
					luatex/source/libs/lua53/lopcodes.c \
					luatex/source/libs/lua53/lparser.c \
					luatex/source/libs/lua53/lstate.c \
					luatex/source/libs/lua53/lstring.c \
					luatex/source/libs/lua53/ltable.c \
					luatex/source/libs/lua53/ltm.c \
					luatex/source/libs/lua53/lundump.c \
					luatex/source/libs/lua53/lvm.c \
					luatex/source/libs/lua53/lzio.c \
					luatex/source/libs/lua53/lauxlib.c \
					luatex/source/libs/lua53/lbaselib.c \
					luatex/source/libs/lua53/lbitlib.c \
					luatex/source/libs/lua53/lcorolib.c \
					luatex/source/libs/lua53/ldblib.c \
					luatex/source/libs/lua53/liolib.c \
					luatex/source/libs/lua53/lmathlib.c \
					luatex/source/libs/lua53/loslib.c \
					luatex/source/libs/lua53/lstrlib.c \
					luatex/source/libs/lua53/ltablib.c \
					luatex/source/libs/lua53/lutf8lib.c \
					luatex/source/libs/lua53/loadlib.c \
					luatex/source/libs/lua53/linit.c

SUPPORT_SOURCES = 	main.c \
					kpseemu.c \
					texfile.c \
					xmemory.c

BUILD_DIR    	=	build

LUATEX_OBJECTS  = 	$(LUATEX_SOURCES:%.c=$(BUILD_DIR)/%.o)
LUA_OBJECTS     = 	$(LUA_SOURCES:%.c=$(BUILD_DIR)/%.o)
SUPPORT_OBJECTS = 	$(SUPPORT_SOURCES:%.c=$(BUILD_DIR)/%.o)

_default:
	@$(MAKE) all --no-print-directory -j

all: $(PROJECT_NAME)

$(PROJECT_NAME): $(LUATEX_OBJECTS) $(LUA_OBJECTS) $(SUPPORT_OBJECTS)
	@$(CXX_LINK) $^ --js-library library.js --pre-js pre.js \
	-s EXPORTED_FUNCTIONS='["_compileLuaLaTeX", "_compileLuaFormat", "_setMainEntry", "_main"]' \
	-s EXPORTED_RUNTIME_METHODS=["cwrap"] \
	-s NO_EXIT_RUNTIME=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s TOTAL_MEMORY=134217728 && \
	echo -e "\033[32m[DONE]\033[0m $(PROJECT_NAME)" || \
	echo -e "\033[31m[ERROR]\033[0m $(PROJECT_NAME)"

$(LUATEX_OBJECTS): $(BUILD_DIR)/%.o : %.c
	@mkdir -p $(dir $@)
	@$(CC) -c $(CFLAGS) $< -o $@ && \
	echo -e "\033[32m[OK]\033[0m $@" || \
	echo -e "\033[31m[ERROR]\033[0m $@"

$(LUA_OBJECTS): $(BUILD_DIR)/%.o : %.c
	@mkdir -p $(dir $@)
	@$(CC) -c $(CFLAGS) $< -o $@ && \
	echo -e "\033[32m[OK]\033[0m $@" || \
	echo -e "\033[31m[ERROR]\033[0m $@"

$(LUATEX_LIB_OBJECTS): $(BUILD_DIR)/%.o : %.c
	@mkdir -p $(dir $@)
	@$(CC) -c $(CFLAGS) $< -o $@ && \
	echo -e "\033[32m[OK]\033[0m $@" || \
	echo -e "\033[31m[ERROR]\033[0m $@"

$(SUPPORT_OBJECTS): $(BUILD_DIR)/%.o : %.c
	@mkdir -p $(dir $@)
	@$(CC) -c $(CFLAGS) -I. $< -o $@ && \
	echo -e "\033[32m[OK]\033[0m $@" || \
	echo -e "\033[31m[ERROR]\033[0m $@"

clean:
	@rm -rf $(BUILD_DIR)
	@echo -e "\033[32m[CLEANED]\033[0m $(PROJECT_NAME)"

fclean: clean
	@rm -f $(PROJECT_NAME)
	@echo -e "\033[32m[FCLEAN]\033[0m $(PROJECT_NAME)"

re: fclean _default

.PHONY: all clean fclean re
.SILENT: all clean fclean re