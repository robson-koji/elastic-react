import i18n from "i18next";

function getValueFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "value",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: bucket.key_as_string || bucket.key,
          count: bucket.doc_count
        }))
      }
    ];
  }
}

/*
function getRangeFacet(aggregations, fieldName) {
  if (
    aggregations &&
    aggregations[fieldName] &&
    aggregations[fieldName].buckets &&
    aggregations[fieldName].buckets.length > 0
  ) {
    return [
      {
        field: fieldName,
        type: "range",
        data: aggregations[fieldName].buckets.map(bucket => ({
          // Boolean values and date values require using `key_as_string`
          value: {
            to: bucket.to,
            from: bucket.from,
            name: bucket.key
          },
          count: bucket.doc_count
        }))
      }
    ];
  }
}
*/


class HierachicalFacet {
  constructor(facet) {    
    this.facet = facet;      
    this.hierarchicalFacets = [];
    // eslint-disable-next-line no-unused-expressions
    this.nextFacet;
  }
  
  rebuild() {
      this.facet.map(elem => {
          this.count = elem.count;
          elem.value.split("|").map((value, idx, array) => {
              let targetFacet = idx === 0 ? this.hierarchicalFacets : this.nextFacet.children
              let currentFacet = targetFacet.find(obj => obj.value_chk === value)
              if (! currentFacet ){
                let idxNextFacet = targetFacet.push({'value_chk':value, 'value':array.join('|'), 'count':this.count, children:[]})
                this.nextFacet = targetFacet[idxNextFacet-1]
              }else{
                this.nextFacet = currentFacet;
              } 
            }
          )
      });
      return(this.hierarchicalFacets);
  }
}


const facetsLst = [i18n.t('area_pt'), 
                i18n.t('programa_tema_pt'), 
                i18n.t('programa_infra_pt'),  
                i18n.t('programa_aplicacao_pt'),  
                i18n.t('programa_percepcao_pt'),  
                i18n.t('auxilio_pesquisa_pt'),  
                i18n.t('ano_inicio'),  
                i18n.t('revista'),  
                i18n.t('bolsas_pt')] 

export default function buildStateFacets(aggregations) {
  const facets = {}
  facetsLst.map( facet =>{
    let newObj; 
    const auxFacet = getValueFacet(aggregations, facet);
    if (auxFacet !== undefined){
      newObj = new HierachicalFacet(auxFacet[0].data)
      auxFacet[0].data = newObj.rebuild()
    }    
    Object.assign(facets, {[facet]:auxFacet} )
  }) 
  
  if (Object.keys(facets).length > 0) {
    return facets;
  }
}
