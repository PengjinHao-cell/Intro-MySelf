/** A reference from one content entry to another. */
export type ContentRef = {
  collection: 'moments' | 'writing' | 'projects' | 'photos'
  id: string
}

/** A problem found while validating related-content references. */
export type RelationIssue = {
  ref: ContentRef
  message: string
}
