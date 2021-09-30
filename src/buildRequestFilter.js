import i18n from "i18next";

/* TODO Centralizar configuracao de facet em um arquivo. 
Hoje estah espalhado por todos os componentes */
const facets = [i18n.t('area_pt'), 
                i18n.t('programa_tema_pt'), 
                i18n.t('programa_infra_pt'),  
                i18n.t('programa_aplicacao_pt'),  
                i18n.t('programa_percepcao_pt'),  
                i18n.t('auxilio_pesquisa_pt'),  
                i18n.t('ano_inicio'),  
                i18n.t('revista'),  
                i18n.t('bolsas_pt')] 


function getTermFilterValue(field, fieldValue) {
  // We do this because if the value is a boolean value, we need to apply
  // our filter differently. We're also only storing the string representation
  // of the boolean value, so we need to convert it to a Boolean.

  // TODO We need better approach for boolean values
  if (fieldValue === "false" || fieldValue === "true") {
    return { [field]: fieldValue === "true" };
  }

  return { [`${field}`]: fieldValue };
  if (field === i18n.t('area_pt')){return { [`${field}`]: fieldValue }; }
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

export default function buildRequestFilter(filters) {
  if (!filters) return;

  filters = filters.reduce((acc, filter) => {
    if (facets.includes(filter.field)) {
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
    if (filter.field !== facet){
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
    }
    else{
      aggNoFilter(agg,facet)    
    }
  });
  
  
  filters = buildRequestPostFilter(filters)
  
  //d3 charts  
  agg['_filter_numero_citacoes'] =  {
    aggs:{'numero_citacoes': {
      terms: {
        field: "ano_publicacao_exact",
        size:34,
        order: { "_term": "desc" }
      },  
      aggs:{
        numero_citacoes: {
          "sum": {
            "field": "numero_citacoes"
          }
        }
      }
    }},
    filter:filters  
  }  
 
  agg['_filter_ano_publicacao_exact'] =  {
    aggs:{'ano_publicacao_exact':{
      terms: {
        field: "ano_publicacao_exact",
        size:34,
        order: { "_term": "desc" }
      }
    }
  },
  filter:filters  
  }


  return agg
}