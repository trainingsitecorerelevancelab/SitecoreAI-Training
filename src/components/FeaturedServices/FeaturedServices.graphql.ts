export const FEATURED_SERVICES_QUERY = `

query FeaturedServices($datasourceId: String! $language:String!)
{
  item(path:$datasourceId, language:$language){
    id
    heading: field(name: "Heading"){
      jsonValue
    }
    ListofServices: field(name: "SelectedServices"){
      ... on MultilistField{
        Services: targetItems{
          id
          name: field(name: "ServiceName"){
            value
          }
          description: field(name: "Description"){
            value
          }
          serviceImage: field(name: "ServiceImage"){
            jsonValue
          }
        }
      }
    }
  }
}
    
`;
