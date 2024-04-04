export interface AuthorResult {
  scopusId: number
  names: string[]
  affiliations: string[]
  articles: number
  topics: string[]
}

export interface PaginationAuthorResult {
  data: AuthorResult[]
  total: number
}

export interface Author {
  scopusId: number
  firstName: string
  lastName: string
  authName: string
  initials: string
  affiliations: string[]
  articles: { scopusId: number, title: string }[]
  topics: string []
  email?: string | "No email" // Optional property with fallback value "No email"
  rol: string
}

export interface Coauthors {
  links: { source: number, target: number, collabStrength: number }[]
  nodes: AuthorNode[]
  affiliations: { scopusId: number, name: string }[]
}


export interface AuthorNode {
  scopusId: number
  initials: string
  firstName: string
  lastName: string
  weight: number
}

export interface RandItem{
  value: string
  size: number
}

//{ scopusId: string, initials: string, firstName: string, lastName: string }

