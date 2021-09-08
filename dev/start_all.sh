
# Inicia listeners para verificar alteracoes no fonte do
# packages original
./watch_packages.sh &

# Inicia projeto do elastic
npm start

# Inicia projeto fonte
# npm run watch --prefix ../../search-ui
