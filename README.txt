Projeto original:
https://github.com/elastic/search-ui

A pasta elastic-react eh um fork desta pasta:
https://github.com/elastic/search-ui/tree/master/examples/elasticsearch

A pasta search-ui é um fork do projeto:
https://github.com/elastic/search-ui

O link @elastic aponta para :
https://github.com/elastic/search-ui/tree/master/packages



Foi efetuado um processo de engenharia reversa para conhecimento da aplicação,
e após a sua análise esta estrutura foi criada:

elasticsearch_react---+
                      |
                      +-----elastic-react
                      |
                      +-----search-ui
                      |
                      +------@elastic

A pasta elastic-react, originalmente é uma pasta interna do projeto search-ui.
Como ela era um exemplo interno de search-ui, por questão de organizacao do projeto,
ela foi colocada no mesmo nivel. Como ela possui referencias ao pacote @elastic,
que sao os pacotes que ficam dentro de search-ui, foi criado um link simbolico
@elastic que aponta para a pasta packages em search-ui.


elastic-react
Contem as estrutura basica da aplicacao reactjs e o conector HTTP para a API do
Elasticsearch.

search-ui
Contem as views e os componentes da aplicacao reactjs

@elastic
Link simbolico


Como usar
=========

Dev
---

Prod
---




Ou seja, originalmente são dois projetos NPM separados e um utiliza o outro como
dependencia.

Para manter a estrutura, para facilitar em caso de atualização, foram mantidos
duas pastas separadas neste mesmo projeto, excluindo a dependencia do @elastic
do npm.


Como usar este projeto
======================

cd elastic-react
npm install



Pendencias
==========
