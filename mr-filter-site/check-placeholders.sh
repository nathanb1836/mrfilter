#!/bin/sh
# Lists everything still unfinished on the site. Run:  sh check-placeholders.sh
echo "Placeholders still in the pages:"
grep -n -o -E '\[[A-Za-z][^]=]{2,80}\]|\$\[__\]|PLACEHOLDER' *.html | grep -v 'data-term' | sort -u
echo
echo "Photo files the pages look for (add .jpg files here, or the box stays blank):"
grep -h -o 'assets/photos/[a-z0-9-]*\.jpg' *.html | sort -u
