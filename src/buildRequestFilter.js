function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === "false" || fieldValue === "true") {
    return { [field]: fieldValue === "true" };
  }

  // debugger;
  return { [`${field}`]: fieldValue };
  if (field == 'area_pt'){return { [`${field}`]: fieldValue }; }
  return { [`${field}.keyword`]: fieldValue };
}

function getTermFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: filter.values.map(filterValue => ({
          term: getTermFilterValue(filter.field, filterValue)
        })),
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: filter.values.map(filterValue => ({
          term: getTermFilterValue(filter.field, filterValue)
        }))
      }
    };
  }
}

function getRangeFilter(filter) {
  if (filter.type === "any") {
    return {
      bool: {
        should: filter.values.map(filterValue => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from })
            }
          }
        })),
        minimum_should_match: 1
      }
    };
  } else if (filter.type === "all") {
    return {
      bool: {
        filter: filter.values.map(filterValue => ({
          range: {
            [filter.field]: {
              ...(filterValue.to && { lt: filterValue.to }),
              ...(filterValue.to && { gt: filterValue.from })
            }
          }
        }))
      }
    };
  }
}


// 'auxilio_pesquisa_pt', 'bolsas_pt', 'ano_inicio', 'revista', 'bolsas_pt'

export default function buildRequestFilter(filters) {
  if (!filters) return;

  filters = filters.reduce((acc, filter) => {
    if (["programa_tema_pt","programa_infra_pt", "area_pt", 'programa_aplicacao_pt', 'programa_percepcao_pt', 'auxilio_pesquisa_pt', 'ano_inicio', 'revista', 'bolsas_pt'].includes(filter.field)) {
      return [...acc, getTermFilter(filter)];
    }
    if (["acres", "visitors"].includes(filter.field)) {
      return [...acc, getRangeFilter(filter)];
    }
    return acc;
  }, []);
  if (filters.length < 1) return;
  return filters;
}


export function buildRequestPostFilter(filters) {
  if (!filters) return;
  
  filters = filters.map( (filter) => {
    return  {"bool":{"should":  
      filter.values.map(filterValue => ({
        term: getTermFilterValue(filter.field, filterValue)
      }))
    }}
  })  
  filters = {'bool':{'must':filters}}  
  if (filters.length < 1) return;
  return filters;
}













/* Centralizar configuracao de facet em um arquivo. 
Hoje estah espalhado por todos os componentes */
const facets = ['area_pt', 'programa_tema_pt', 'programa_infra_pt', 'programa_aplicacao_pt', 'programa_percepcao_pt', 'auxilio_pesquisa_pt', 'ano_inicio', 'revista', 'bolsas_pt']

function aggNoFilter(agg,facet){
  agg[[facet]] = {
    terms: { field: facet, size:3000, order: { "_term": "asc" } }
  }
}

function aggWithFilter(agg, facet, termFilterValue){
  let filter_facet = '_filter_' + facet; 
  let should = []

  termFilterValue.map((term) => {
    let field = term.field
    should.push({'bool':{'should':(term.values.map( value => {      
      return {'term':{[field]:value}}
    }))}})    
  })    

  let must = {'bool':{'must':should}}

  agg[[filter_facet]] = {
      filter: {
        bool:{
          should:must
        }
      },
      aggs: {
        [facet]: {
          terms: { field: facet, size: 3000, order: { "_term": "asc" } }
        }
      }
    }
}

function filterVsFacet(facet, filters){
  // Return facets that will be filtered by other facets.
  let termFilterValue = filters.filter( (filter) => {   
    if (filter.field != facet){
      return filter.values.map( (value) => {
        return getTermFilterValue(filter.field, value)
      })
    }
  })
  return termFilterValue
}

export function buildRequestFilterAggs(filters) {
  if (!filters) return;
  let agg = {}

  facets.forEach(facet => {
    let termFilterValue = filterVsFacet(facet, filters); 
    if (termFilterValue.length>0){      
      aggWithFilter(agg,facet, termFilterValue)
      // console.log(JSON.stringify(agg))
      // debugger
    }
    else{
      aggNoFilter(agg,facet)    
    }
    // console.log(agg)
  });




  /* Adicionando, senao dando pau. Remover todas as referencias. */
  agg['visitors'] =  {
    range: {
      field: "visitors",
      ranges: [
        { from: 0.0, to: 10000.0, key: "0 - 10000" },
        { from: 10001.0, to: 100000.0, key: "10001 - 100000" },
        { from: 100001.0, to: 500000.0, key: "100001 - 500000" },
        { from: 500001.0, to: 1000000.0, key: "500001 - 1000000" },
        { from: 1000001.0, to: 5000000.0, key: "1000001 - 5000000" },
        { from: 5000001.0, to: 10000000.0, key: "5000001 - 10000000" },
        { from: 10000001.0, key: "10000001+" }
      ]
    }
  }
  agg['acres'] = {
    range: {
      field: "acres",
      ranges: [
        { from: -1.0, key: "Any" },
        { from: 0.0, to: 1000.0, key: "Small" },
        { from: 1001.0, to: 100000.0, key: "Medium" },
        { from: 100001.0, key: "Large" }
      ]
    }
  }

  return agg
}