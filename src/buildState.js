import buildStateFacets from "./buildStateFacets";

function buildTotalPages(resultsPerPage, totalResults) {
  if (!resultsPerPage) return 0;
  if (totalResults === 0) return 1;
  return Math.ceil(totalResults / resultsPerPage);
}


function fillHistogramDateCharts(buckets, field){
  const today_year = new Date().getFullYear()
  let start_year = 1990
  let filled = []
  
  if (field === 'doc_count'){
    filled = buckets.map( elem =>({'date':elem.key, 'value':elem[field]}))
  }
  else{
    filled = buckets.map( elem =>({'date':elem.key, 'value':elem[field].value}))
  }
  while (start_year < today_year){
    if (! filled.find(o => o.date === start_year)){
      filled.push({'date':start_year, 'value':0})
    }
    start_year++;
  }
  filled.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))//.reverse()

  // debugger;
  return filled
}
  
function buildStateCharts(aggs){
  if (!aggs) return;
  return {
    'numero_citacoes': fillHistogramDateCharts(aggs['_filter_numero_citacoes']['numero_citacoes']['buckets'], 'numero_citacoes'),
    'ano_publicacao_exact': fillHistogramDateCharts(aggs['_filter_ano_publicacao_exact']['ano_publicacao_exact']['buckets'], 'doc_count')
  }
}

function buildTotalResults(hits) {
  return hits.total.value;
}

function getHighlight(hit, fieldName) {
  if (hit._source.title === "Rocky Mountain" && fieldName === "title") {
    window.hit = hit;
    window.fieldName = fieldName;
  }
  if (
    !hit.highlight ||
    !hit.highlight[fieldName] ||
    hit.highlight[fieldName].length < 1
  ) {
    return;
  }

  return hit.highlight[fieldName][0];
}

function buildResults(hits) {
  const addEachKeyValueToObject = (acc, [key, value]) => ({
    ...acc,
    [key]: value
  });

  const toObject = (value, snippet) => {
    return { raw: value, ...(snippet && { snippet }) };
  };

  return hits.map(record => {
    return Object.entries(record._source)
      .map(([fieldName, fieldValue]) => [
        fieldName,
        toObject(fieldValue, getHighlight(record, fieldName))
      ])
      .reduce(addEachKeyValueToObject, {});
  });
}

/*
  Converts an Elasticsearch response to new application state

  When implementing an onSearch Handler in Search UI, the handler needs to convert
  search results into a new application state that Search UI understands.

  For instance, Elasticsearch returns "hits" for search results. This maps to
  the "results" property in application state, which requires a specific format. So this
  file iterates through "hits" and reformats them to "results" that Search UI
  understands.

  We do similar things for facets and totals.
*/


function cleanFilteredFacets(facets){
  if (!facets) return;

  let recover_facet = {}  
  facets = Object.entries(facets).forEach(([key, value]) => {
    const key_clean = key.split("filter_").pop()
    // recover_facet.push( key.startsWith('_filter_') ? { [key_clean]:value[key_clean] } : { [key]:value } )
    if ( key.startsWith('_filter_')){
      recover_facet[[key_clean]] = value[key_clean]
    } else{
      recover_facet[[key]] = value
    }      
  });
  return recover_facet
}


export default function buildState(response, resultsPerPage) {
  const results = buildResults(response.hits.hits);
  const totalResults = buildTotalResults(response.hits);
  const totalPages = buildTotalPages(resultsPerPage, totalResults);
  const facets = buildStateFacets(cleanFilteredFacets(response.aggregations));
  const charts = buildStateCharts(response.aggregations);
  return {
    results,
    totalPages,
    totalResults,
    ...(facets && { facets }),
    ...(charts && { charts })

  };
}
