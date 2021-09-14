import React from "react";

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
  Sorting
} from "@elastic/react-search-ui";
import { Layout, SingleSelectFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";


/* Bug no chrome nao funciona o F8, atualmente na versao 83.
Qdo o bug for consertado, remover isso */

document.addEventListener('keydown', function (e) {
  if (e.keyCode == 119) { // F8
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
    return buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage);
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => (
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
                sideContent={
                  <div>
                    {wasSearched && (
                      <Sorting
                        label={"Sort by"}
                        sortOptions={[
                        {
                          name: "Relevancia",
                          value: "",
                          direction: ""
                        },
                        {
                          name: "Citações",
                          value: "numero_citacoes",
                          direction: "desc"
                        },
                        {
                          name: "Data de Publicação",
                          value: "data_iso",
                          direction: "desc"
                        },
                        {
                          name: "Revista",
                          value: "revista",
                          direction: "asc"
                        }
                        ]}
                      />
                    )}
                    <Facet
                      field="auxilio_pesquisa_pt"
                      label="Auxílios à Pesquisa"
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field="bolsas_pt"
                      label="Bolsas"
                      filterType="any"                      
                    />
                    <Facet
                      field="programa_tema_pt"
                      label="Programas voltados a Temas Específicos"
                      filterType="any"
                      isFilterable={true}
                    />                    
                    <Facet
                      field="programa_aplicacao_pt"
                      label="Programas de Pesquisa direcionados a Aplicações"
                      filterType="any"                      
                    />
                    <Facet
                      field="programa_percepcao_pt"
                      label="Programas de Percepção Pública da Ciência"
                      filterType="any"                      
                    />
                     <Facet
                      field="programa_infra_pt"
                      label="Programas de Infraestrutura de Pesquisa"
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field="area_pt"
                      label="Área do conhecimento"
                      filterType="any"
                      isFilterable={true}
                    />
                    <Facet
                      field="ano_inicio"
                      label="Ano de início do Auxílio / Bolsa"
                    />
                    <Facet
                      field="revista"
                      label="Revista"
                      filterType="any"
                      isFilterable={true}
                    />

                    <Facet field="visitors" label="Visitors" filterType="any" />
                    <Facet
                      field="acres"
                      label="Acres"
                      view={SingleSelectFacet}
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
                    {wasSearched && <PagingInfo />}
                    {wasSearched && <ResultsPerPage />}
                  </React.Fragment>
                }
                bodyFooter={<Paging />}
              />
            </ErrorBoundary>
          </div>
        )}
      </WithSearch>
    </SearchProvider>
  );
}
