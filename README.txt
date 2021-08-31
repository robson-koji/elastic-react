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



Pendencias
==========
- Trabalhar nos facets
- Trabalhar nos componentes originais e tentar compilar.


Obs:
===
Iniciar em dev
cd /home/rmoriya/projetos/search-ui/examples/elasticsearch
npm start
