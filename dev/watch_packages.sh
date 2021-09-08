#!/bin/sh

# nao estah funcionando a lista de diretorios,
# ouvindo cada um individualmente.

/usr/bin/inotifywait -mre create,delete,modify ../../search-ui/packages/search-ui/es|
while read line
do
    /usr/bin/touch ../src/App.js
done

/usr/bin/inotifywait -mre create,delete,modify ../../search-ui/packages/react-search-ui/es|
while read line
do
    /usr/bin/touch ../src/App.js
done

/usr/bin/inotifywait -mre create,delete,modify ../../search-ui/packages/react-search-ui-views/es|
while read line
do
    /usr/bin/touch ../src/App.js
done
