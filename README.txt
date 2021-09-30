Projeto clone do original:
https://gitlab.com/bv_fapesp/search-ui
Nunca deverá se alterado diretamente. Somente qdo sincronizado com o original.

Projeto com as dependencias (packages) alterados:
https://gitlab.com/bv_fapesp/custom-search-ui
Aqui sobem as alteracoes feitas sobre o original

Projeto base (vem como exemplo dentro do projeto original)
https://gitlab.com/bv_fapesp/elastic-react
Este projeto vem como exemplo dentro do projeto original e usa os pacotes acima como 
dependencia. 
Com a estrutura atual, poderah vir a ser alterad diretamente no projeto custom-search-ui,
mas por ora estao em projetos separados.

COMO USAR


CLONAR
======
Clonar os dois projetos dentro de uma mesma pasta
git clone https://gitlab.com/bv_fapesp/elastic-react.git
git clone https://gitlab.com/bv_fapesp/custom-search-ui

NPM INSTALL
===========
npm install nos dois projetos

LINKAR OS DOIS PROJETOS
=======================
Na pasta node_modules do elastic-react.git, fazer o link para o custom-search-ui. 
node_modules/@elastic -> ../../search-ui/packages/

Se instalar algum pacote no elastic-react.git após estar linkado, vai dar problema e precisa 
reinstalar os pacotes no custom-search-ui

REACT DUPLICADO
===============
Após npm install nos dois projetos, apagar o pacote react dos projetos abaixo pq estah dando conflito.

search-ui/packages/react-search-ui-views/node_modules
search-ui/packages/react-search-ui/node_modules



.env
REACT_APP_API_URL="http://elasticsearch-api/"
REACT_APP_ENV = “dev”


===========================================================================


Build
=====
cd ~/projetos/elasticsearch_react/elastic-react
nmp run build

Até aqui, ele builda na pasta ~/projetos/elasticsearch_react/elastic-react/build
Este ambiente tem o .env, e ele sobe automaticamente na porta 5000. Basta 
ter o servidor "serve" instalado. 

tar -czvf build.tar.gz build
scp build.tar.gz you@server:~/projetos/bv/memoria

cd ~/projetos/bv/memoria
tar -xzvf build.tar.gz

Limpa diretorio de estaticos
rm -rf  static/memoria/build/
cp -R build/static/ static/memoria/build/

Acertar os estaticos em:
~/projetos/bv/memoria/templates/memoria/react/index.html

com as referencias daqui:
~/projetos/bv/memoria/build/index.html



Deployment
==========
https://create-react-app.dev/docs/deployment/
Pasta static do build vem aqui:
  memoria/static/
Essa eh a home page em:
  http://shedar.fapesp.br:9000/pt/memoria/publicacoes-cientificas-rct/
  memoria/templates/memoria/publicacoes_cientificas_rct.html
Por enquanto carrega um iframe na pg acima. Depois ver como isolar os CSSs.
  memoria/templates/memoria/react/

Alterar os estaticos toda vez que houver novo build:
  memoria/templates/memoria/react/index.html
