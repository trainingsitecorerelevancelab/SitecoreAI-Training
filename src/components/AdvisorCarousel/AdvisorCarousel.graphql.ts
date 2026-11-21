export const ADVISOR_CAROUSEL_QUERY = `
query AdvisorCarousel($datasourceId: String!, $language: String!) {
  item(path: $datasourceId, language: $language){
    id
    slideDuration: field(name: "SlideDuration"){
      value
    }
    slides:field(name:"Slides"){
      ... on MultilistField{
        targetItems{
			...slideValues
        }
      }
    }
  }
}
fragment slideValues on Item{
  id
  eyebrow:field(name:"Eyebrow"){jsonValue}
  headline:field(name:"Headline"){jsonValue}
  description:field(name:"description"){jsonValue}
  advisorImage:field(name:"advisorImage"){jsonValue}
  cta:field(name:"cta"){jsonValue}
  secondaryCta:field(name:"secondaryCta"){jsonValue}
  badgeText:field(name:"badgeText"){jsonValue}
  trackingKey:field(name:"trackingKey"){jsonValue}
}
`;
