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
          // console.log(JSON.stringify(value))
          elem.value.split("|").map(
              (value, idx, array) => {
                  let targetFacet = idx === 0 ? this.hierarchicalFacets : this.nextFacet.children
                  let currentFacet = targetFacet.find(obj => obj.value_chk === value)

                  if (! currentFacet ){
                      // console.log(JSON.stringify(value))
                      let idxNextFacet = targetFacet.push({'value_chk':value, 'value':array.join('|'), 'count':this.count, children:[]})
                      this.nextFacet = targetFacet[idxNextFacet-1]
                  }else{
                      // currentFacet.count += this.count;
                      this.nextFacet = currentFacet;
                  } 
              }
          )
      });
      // debugger;
      return(this.hierarchicalFacets);
  }
}

/* TODO
// Generalizar a funcao abaixo utilizando esta lista. 
facets_lst = [auxilio_pesquisa_pt, bolsas_pt, area_pt, programa_tema_pt,
              programa_infra_pt, programa_aplicacao_pt, programa_percepcao_pt, 
              ano_inicio, revista]
*/

export default function buildStateFacets(aggregations) {
  const auxilio_pesquisa_pt = getValueFacet(aggregations, "auxilio_pesquisa_pt");
  const bolsas_pt = getValueFacet(aggregations, "bolsas_pt");  
  const area_pt = getValueFacet(aggregations, "area_pt");
  const programa_tema_pt = getValueFacet(aggregations, "programa_tema_pt");
  const programa_infra_pt = getValueFacet(aggregations, "programa_infra_pt");
  const programa_aplicacao_pt = getValueFacet(aggregations, "programa_aplicacao_pt");
  const programa_percepcao_pt = getValueFacet(aggregations, "programa_percepcao_pt");
  const ano_inicio = getValueFacet(aggregations, "ano_inicio");
  const revista = getValueFacet(aggregations, "revista");
  let newObj; 

  if (auxilio_pesquisa_pt !== undefined){
    newObj = new HierachicalFacet(auxilio_pesquisa_pt[0].data)
    auxilio_pesquisa_pt[0].data = newObj.rebuild()
  }
  if (bolsas_pt !== undefined){
    newObj = new HierachicalFacet(bolsas_pt[0].data)
    bolsas_pt[0].data = newObj.rebuild()
  }  
  if (area_pt !== undefined){
    newObj = new HierachicalFacet(area_pt[0].data)
    area_pt[0].data = newObj.rebuild()
  }
  if (programa_tema_pt !== undefined){
    newObj = new HierachicalFacet(programa_tema_pt[0].data)
    programa_tema_pt[0].data = newObj.rebuild()
  }
  if (programa_infra_pt !== undefined){
    newObj = new HierachicalFacet(programa_infra_pt[0].data)
    programa_infra_pt[0].data = newObj.rebuild()
  }
  if (programa_aplicacao_pt !== undefined){
    newObj = new HierachicalFacet(programa_aplicacao_pt[0].data)
    programa_aplicacao_pt[0].data = newObj.rebuild()
  }  
  if (programa_percepcao_pt !== undefined){
    newObj = new HierachicalFacet(programa_percepcao_pt[0].data)
    programa_percepcao_pt[0].data = newObj.rebuild()
  }
  if (ano_inicio !== undefined){
    newObj = new HierachicalFacet(ano_inicio[0].data)
    ano_inicio[0].data = newObj.rebuild()
  }
  if (revista !== undefined){
    newObj = new HierachicalFacet(revista[0].data)
    revista[0].data = newObj.rebuild()
  }

  const facets = {
    ...(auxilio_pesquisa_pt && { auxilio_pesquisa_pt }),
    ...(bolsas_pt && { bolsas_pt }),
    ...(area_pt && { area_pt }),
    ...(programa_infra_pt && { programa_infra_pt }),
    ...(programa_tema_pt && { programa_tema_pt }),
    ...(programa_aplicacao_pt && { programa_aplicacao_pt }),
    ...(programa_percepcao_pt && { programa_percepcao_pt }),
    ...(ano_inicio && { ano_inicio }),
    ...(revista && { revista })
  };

  if (Object.keys(facets).length > 0) {
    return facets;
  }
}
