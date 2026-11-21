export const PERSONALIZED_PROJECT_GALLERY_QUERY = `
  query PersonalizedProjectGallery(
    $datasourceId: String!
    $language: String!
  ) {
    datasource: item(
      path: $datasourceId
      language: $language
    ) {
      id
      name

      heading: field(name: "Heading") {
        value
      }

      description: field(name: "Description") {
        value
      }

      projects: field(name: "Projects") {
        ... on MultilistField {
          targetItems {
            id
            name

            projectTitle: field(name: "ProjectTitle") {
              value
            }

            projectDescription: field(
              name: "ProjectDescription"
            ) {
              value
            }

            projectImage: field(name: "ProjectImage") {
              jsonValue
            }

            designStyle: field(name: "DesignStyle") {
              value
            }

            priority: field(name: "Priority") {
              value
            }

            roomType: field(name: "RoomType") {
              value
            }

            projectLink: field(name: "ProjectLink") {
              jsonValue
            }
          }
        }
      }
    }
  }
`;
