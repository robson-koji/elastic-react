
import React from "react";
import i18n from './i18n';

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  Messages
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";


import {BarChart} from "@elastic/react-search-ui";



/* Bug no chrome nao funciona o F8, atualmente na versao 83.
Qdo o bug for consertado, remover isso */

document.addEventListener('keydown', function (e) {
  if (e.keyCode === 119) { // F8
      debugger;
  }
}, {
  capture: true
});






const config = {
  debug: true,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async ({ searchTerm }) => {
    const requestBody = buildRequest({ searchTerm });
    const json = await runRequest(requestBody);
    const state = buildState(json);
    return {
      autocompletedResults: state.results
    };
  },
  onSearch: async state => {
    const { resultsPerPage } = state;
    const requestBody = buildRequest(state);
    // Note that this could be optimized by running all of these requests
    // at the same time. Kept simple here for clarity.
    const responseJson = await runRequest(requestBody);
    const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
      responseJson,
      state,
      ["visitors", "states"]
    );

    const bs = buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage);
    const body_div = document.getElementsByClassName('sui-layout-body')[0];
    if (bs.facets === undefined){
      body_div.style.display = 'none';
    }
    else{
      body_div.style.display = 'block';
    }
    return bs
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched, hasResults }) => ({ wasSearched, hasResults })}>
        {({ wasSearched, hasResults }) => (
          <div className="App">
            <ErrorBoundary>
              <Layout
                header={
                  <SearchBox
                    autocompleteMinimumCharacters={3}
                    autocompleteResults={{
                      linkTarget: "_blank",
                      sectionTitle: "Results",
                      titleField: "resumo",
                      urlField: "absolute_url_pt_t",
                      shouldTrackClickThrough: true,
                      clickThroughTags: ["test"]
                    }}
                    autocompleteSuggestions={true}
                  />
                }

                chartContent={
                  <React.Fragment>
                      {wasSearched && <BarChart
                      data={'ano_publicacao_exact'}
                      titulo={i18n.t("Publicações por ano")}
                      wos_div={'.sui-layout-body-chart-articles'}
                    />}
                    {/* {wasSearched && <BarChart
                      data={'numero_citacoes'}
                      titulo={i18n.t("Citações por ano (Web of Science)")}
                      wos_div={'.sui-layout-body-chart-citations'}
                    />}*/}
                  </React.Fragment>
                }

                messagesContent={
                  <div>
                  {wasSearched && ! hasResults && (<Messages />)
                  }
                  </div>
                }
                sideContent={
                  <div>
                    {hasResults && (
                      <Sorting
                        label= {i18n.t("Ordenar")}
                        sortOptions={[
                        {
                          name: i18n.t("Relevância"),
                          value: "",
                          direction: ""
                        },
                        {
                          name: i18n.t("Citações"),
                          value: "numero_citacoes",
                          direction: "desc"
                        },
                        {
                          name: i18n.t("Data de Publicação"),
                          value: "data_iso",
                          direction: "desc"
                        },
                        {
                          name: i18n.t("Revista"),
                          value: "revista",
                          direction: "asc"
                        }
                        ]}
                      />
                    )}
                    <Facet
                      field={i18n.t("auxilio_pesquisa_pt")}
                      label={i18n.t("Auxílios à Pesquisa")}
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field={i18n.t("bolsas_pt")}
                      label={i18n.t("Bolsas")}
                      filterType="any"
                    />
                    <Facet
                      field={i18n.t("programa_tema_pt")}
                      label={i18n.t("Programas voltados a Temas Específicos")}
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field={i18n.t("programa_aplicacao_pt")}
                      label={i18n.t("Programas de Pesquisa direcionados a Aplicações")}
                      filterType="any"
                    />
                    <Facet
                      field={i18n.t("programa_percepcao_pt")}
                      label={i18n.t("Programas de Percepção Pública da Ciência")}
                      filterType="any"
                    />
                     <Facet
                      field={i18n.t("programa_infra_pt")}
                      label={i18n.t("Programas de Infraestrutura de Pesquisa")}
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field={i18n.t("area_pt")}
                      label={i18n.t("Área do conhecimento")}
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field={i18n.t("ano_inicio")}
                      label={i18n.t("Ano de início do Auxílio / Bolsa")}
                    />
                    <Facet
                      field={i18n.t("revista")}
                      label={i18n.t("Revista")}
                      filterType="any"
                      isFilterable={true}
                    />


                  </div>
                }

                bodyContent={
                  <Results
                    shouldTrackClickThrough={true}
                  />
                }
                bodyHeader={
                  <React.Fragment>
                    {hasResults && <PagingInfo />}
                    {hasResults && <ResultsPerPage />}
                  </React.Fragment>
                }
                bodyFooter={hasResults && <Paging />}
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
