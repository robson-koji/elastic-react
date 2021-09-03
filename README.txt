Projeto original:
https://github.com/elastic/search-ui

Este projeto eh um fork desta pasta:
https://github.com/elastic/search-ui/tree/master/examples/elasticsearch

Para manter este projeto atualizado com o original:

Clonar este projeto
git clone https://gitlab.com/bv_fapesp/elastic-react.git

dentro desta pasta do projeto original, que dever ser um clone do projeto original.
/search-ui/examples/

Qdo precisar sincronizar, dar o pull e resolver as pendencias:
https://github.com/elastic/search-ui.git


Como usar este projeto
======================
git clone https://gitlab.com/bv_fapesp/elastic-react.git
npm install


.env
REACT_APP_API_URL="http://elasticsearch-api/"
REACT_APP_ENV = “dev”
~

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


Build
=====
cd ~/projetos/elasticsearch_react/search-ui/examples/elasticsearch
nmp run build
tar -czvf build.tar.gz build
scp build.tar.gz you@server:~/projetos/bv/memoria

cd ~/projetos/bv/memoria
tar -xzvf build.tar.gz
cp -R build/static/ static/memoria/build/

Acertar os estaticos em:
~/projetos/bv/memoria/templates/memoria/react/index.html






Pendencias
==========
- Trabalhar nos facets
- Trabalhar nos componentes originais e tentar compilar.


Obs:
===
Iniciar em dev
cd ~/projetos/search-ui/examples/elasticsearch
npm start



Alteracoes no original
======================
Alterados nos pacotes babel da pasta /es
Alterar no src e compilar estah dando erro. Resolver isso

adicionando target blank para abrir novo link
https://gitlab.com/bv_fapesp/elastic-react/-/blob/master/node_modules/@elastic/react-search-ui-views/es/Result.js

@elastic - apresentando referencias
https://gitlab.com/bv_fapesp/elastic-react/-/blob/master/node_modules/@elastic/react-search-ui/es/containers/Result.js
https://gitlab.com/bv_fapesp/elastic-react/-/blob/master/node_modules/@elastic/react-search-ui/es/containers/Results.js
