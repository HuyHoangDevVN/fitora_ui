export class PaginatedResult<TEntity> {
  public pageIndex: number;
  public pageSize: number;
  public count: number;
  public data: TEntity[];

  constructor(
    pageIndex: number,
    pageSize: number,
    count: number,
    data: TEntity[]
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.count = count;
    this.data = data;
  }
}
