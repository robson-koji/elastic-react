import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // we init with resources
  detection:{
      order: ['path']
    },
  resources: {
    pt: {
      translations: {
        "Citações por ano (Web of Science)": "Citações por ano (Web of Science)", 
        "Publicações por ano": "Publicações por ano",
        "Buscar": "Buscar",
        "Mostrando": "Mostrando",
        "de": "de", 
        "para": "para", 
        "Mostrar": "Mostrar",
        "Ordenar": "Ordenar",
        "Relevância": "Relevância",
        "Citações": "Citações",
        "Data de Publicação": "Data de Publicação",
        "Revista": "Revista",
        "Mais": "Mais",
        "Filtrar": "Filtrar",

        "auxilio_pesquisa_pt": "auxilio_pesquisa_pt",
        "Auxílios à Pesquisa": "Auxílios à Pesquisa",
        "bolsas_pt": "bolsas_pt",
        "Bolsas": "Bolsas",
        "programa_tema_pt": "programa_tema_pt",
        "Programas voltados a Temas Específicos": "Programas voltados a Temas Específicos",
        "programa_aplicacao_pt": "programa_aplicacao_pt",
        "Programas de Pesquisa direcionados a Aplicações": "Programas de Pesquisa direcionados a Aplicações",
        "programa_percepcao_pt": "programa_percepcao_pt",
        "Programas de Percepção Pública da Ciência": "Programas de Percepção Pública da Ciência",
        "programa_infra_pt": "programa_infra_pt",
        "Programas de Infraestrutura de Pesquisa": "Programas de Infraestrutura de Pesquisa",
        "area_pt": "area_pt",
        "Área do conhecimento": "Área do conhecimento",
        "ano_inicio": "ano_inicio",
        "Ano de início do Auxílio / Bolsa": "Ano de início do Auxílio / Bolsa",
        "revista": "revista",

        "referencia": "referencia",
        "absolute_url_pt_t":"absolute_url_pt_t"
      }
    },
    en: {
      translations: {
        "Citações por ano (Web of Science)": "Citations / Year (Web of Science)",
        "Publicações por ano": "Publications / Year",
        "Buscar": "Search",
        "Mostrando": "Showing",
        "de": "out of",
        "para": "for", 
        "Mostrar": "Show",
        "Ordenar": "Sort by",
        "Relevância": "Relevance",
        "Citações": "Citations",
        "Data de Publicação": "Publication date",
        "Revista": "Journal",
        "Mais": "More",
        "Filtrar":"Filter",

        "auxilio_pesquisa_pt": "auxilio_pesquisa_en",
        "Auxílios à Pesquisa": "Research Grants",
        "bolsas_pt": "bolsas_en",
        "Bolsas": "Scholarships",
        "programa_tema_pt": "programa_tema_en",
        "Programas voltados a Temas Específicos": "Theme-oriented Programs",
        "programa_aplicacao_pt": "programa_aplicacao_en",
        "Programas de Pesquisa direcionados a Aplicações": "Applications-oriented Research Programs",
        "programa_percepcao_pt": "programa_percepcao_en",
        "Programas de Percepção Pública da Ciência": "Science Awareness Programs",
        "programa_infra_pt": "programa_infra_en",
        "Programas de Infraestrutura de Pesquisa": "Research Infrastructure Programs",
        "area_pt": "area_en",
        "Área do conhecimento": "Field of knowledge",
        "ano_inicio": "ano_inicio",
        "Ano de início do Auxílio / Bolsa": "Research Grant Start Date",
        "revista": "revista",
       
        "referencia": "referencia_en",
        "absolute_url_pt_t": "absolute_url_en_t"       

      }
    }

  },
  whitelist: ['en', 'pt'],
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;