export const FEATURED_SERVICES_QUERY = `
  query FeaturedServices(
    $datasourceId: String!
    $language: String!
  ) {
    item(path: $datasourceId, language: $language) {
      id
      heading: field(name: "Heading") {
        jsonValue
      }
      selectedServices: field(name: "SelectedServices") {
        ... on MultilistField {
          targetItems {
            id
            serviceName: field(name: "ServiceName") {
              jsonValue
            }
            description: field(name: "Description") {
              jsonValue
            }
            serviceImage: field(name: "ServiceImage") {
              jsonValue
            }
          }
        }
      }
    }
  }
`;
