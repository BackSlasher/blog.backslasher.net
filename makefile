.PHONY: init build serve

init:
	bundle

build:
	bundle exec jekyll b

serve:
	bundle exec jekyll s
