export class PaginatedCursorResult<TEntity> {
  public cursor: number | null;
  public limit: number;
  public count: number;
  public data: TEntity[];
  public nextCursor: number | null;

  constructor(
    cursor: number | null,
    limit: number,
    count: number,
    data: TEntity[],
    nextCursor: number | null
  ) {
    this.cursor = cursor;
    this.limit = limit;
    this.count = count;
    this.data = data;
    this.nextCursor = nextCursor;
  }
}
