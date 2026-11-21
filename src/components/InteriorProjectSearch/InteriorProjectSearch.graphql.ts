import type { SearchCriteria } from './InteriorProjectSearch.types';

type Condition = { name: string; value: string; operator: 'EQ' | 'CONTAINS' } | { OR: Condition[] };

export const INTERIOR_SEARCH_QUERY = `
  query InteriorSearch(
    $where: ItemSearchPredicateInput!
    $first: Int!
    $after: String
  ) {
    search(
      where: $where
      first: $first
      after: $after
    ) {
      total
      pageInfo {
        hasNext
        endCursor
      }
      results {
        id
        name
        url { path }
        detailPage: field(name: "DetailPage") { jsonValue }
        projectName: field(name: "ProjectName") { value }
        description: field(name: "Description") { value }
        designStyle: field(name: "DesignStyle") { value }
        roomType: field(name: "RoomType") { value }
        location: field(name: "Location") { value }
        completionDate: field(name: "CompletionDate") { value }
        featured: field(name: "Featured") { value }
        projectImage: field(name: "ProjectImage") { jsonValue }
      }
    }
  }
`;

export function buildSearchVariables(criteria: SearchCriteria, templateId: string, rootId: string) {
  const conditions: Condition[] = [
    {
      name: '_templates',
      value: templateId.replace(/[{}-]/g, '').toLowerCase(),
      operator: 'CONTAINS',
    },
    {
      name: '_path',
      value: rootId.replace(/[{}-]/g, '').toLowerCase(),
      operator: 'CONTAINS',
    },
    {
      name: '_language',
      value: 'en',
      operator: 'EQ',
    },
  ];

  if (criteria.keyword.trim()) {
    conditions.push({
      OR: [
        {
          name: 'ProjectName',
          value: criteria.keyword.trim(),
          operator: 'CONTAINS',
        },
        {
          name: 'Description',
          value: criteria.keyword.trim(),
          operator: 'CONTAINS',
        },
      ],
    });
  }

  if (criteria.style) {
    conditions.push({
      name: 'DesignStyle',
      value: criteria.style,
      operator: 'EQ',
    });
  }

  if (criteria.room) {
    conditions.push({
      name: 'RoomType',
      value: criteria.room,
      operator: 'EQ',
    });
  }

  return {
    where: { AND: conditions },
    first: 9,
    after: criteria.cursor ?? null,
  };
}
