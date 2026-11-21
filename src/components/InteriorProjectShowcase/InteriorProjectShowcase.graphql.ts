export const INTERIOR_PROJECTS_QUERY = `
  query InteriorProjects($rootPath: String!, $language: String!) {
    item(path: $rootPath, language: $language) {
      id
      name
      children(first: 18) {
        results {
          id
          name

          title: field(name: "ProjectTitle") {
            jsonValue
          }

          description: field(name: "ProjectDescription") {
            jsonValue
          }

          designStyle: field(name: "DesignStyle") {
            jsonValue
          }

          image: field(name: "ProjectImage") {
            jsonValue
          }

          location: field(name: "ProjectLocation") {
            jsonValue
          }

          displayOrder: field(name: "DisplayOrder") {
            jsonValue
          }
        }
      }
    }
  }
`;
