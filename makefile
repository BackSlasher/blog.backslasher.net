.PHONY: init build serve theme

THEME_REPO := mmistakes/minimal-mistakes
THEME_REF  := 4.24.0
THEME_DIR  := .themes/mmistakes-minimal-mistakes-$(THEME_REF)

# Loaded before Jekyll starts so it can serve `remote_theme` from $(THEME_DIR)
# instead of downloading it. RUBYOPT is the only hook early enough; see the
# comment in _local_remote_theme.rb.
JEKYLL := RUBYOPT="-r$(CURDIR)/_local_remote_theme.rb" bundle exec jekyll

init:
	bundle

# Refresh the local copy of the theme. Cloning over https avoids the
# codeload.github.com zip endpoint, which rate-limits aggressively (HTTP 429).
theme: | $(THEME_DIR)
$(THEME_DIR):
	rm -rf $(THEME_DIR) $(THEME_DIR).tmp
	git clone --quiet --depth 1 --branch $(THEME_REF) \
		https://github.com/$(THEME_REPO).git $(THEME_DIR).tmp
	rm -rf $(THEME_DIR).tmp/.git $(THEME_DIR).tmp/docs $(THEME_DIR).tmp/test
	mv $(THEME_DIR).tmp $(THEME_DIR)

build: | $(THEME_DIR)
	$(JEKYLL) b

serve: | $(THEME_DIR)
	$(JEKYLL) s
