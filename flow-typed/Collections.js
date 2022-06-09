declare type Collection = {
  id: string,
  items: Array<?string>,
  name: string,
  type: string,
  updatedAt: number,
  totalItems?: number,
  sourceId?: string, // if copied, claimId of original collection
};

declare type CollectionState = {
  unpublished: CollectionGroup,
  resolved: CollectionGroup,
  pending: CollectionGroup,
  edited: CollectionGroup,
  builtin: CollectionGroup,
  isResolvingCollectionById: { [string]: boolean },
  error?: string | null,
  queue: Collection,
};

declare type CollectionGroup = {
  [string]: Collection,
};

declare type CollectionEditParams = {
  uris?: Array<string>,
  remove?: boolean,
  replace?: boolean,
  order?: { from: number, to: number },
  type?: string,
  name?: string,
};

declare type CollectionFetchParams = {
  collectionId: string,
  pageSize?: number,
};
