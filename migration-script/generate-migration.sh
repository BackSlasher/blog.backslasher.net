#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# POSTS
for FILENAME in $DIR/../content/*.md; do
    DATE=$(head -n 10 "$FILENAME" | grep '^Date: ' | cut -f2 -d ' ')
    YEAR=$(echo $DATE | cut -f1 -d '-')
    MONTH=$(echo $DATE | cut -f2 -d '-')
    SLUG=$(head -n 10 $FILENAME | grep '^Slug: ' | cut -f2 -d ' ')
    [ -n "$SLUG" ] || SLUG=$(basename "$FILENAME" | perl -p -e 's/\.[^\.]+$//g')
    OLDSLUG=$(head -n 10 $FILENAME | grep '^OldSlug: ' | cut -f2 -d ' ')

    echo "'$YEAR/$MONTH/$OLDSLUG.html' => '$SLUG'"
done
