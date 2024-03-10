export function Pagination(items, totalCount, currentPage, pageSize) {
  //calculate total pages
  let totalPages = 0;

  if (totalCount > 0 && pageSize > 0) {
    totalPages = Math.ceil(totalCount / pageSize);
  }

  this.items = [...items];
  this.currentPage = currentPage;
  this.pageSize = pageSize;
  this.totalCount = totalCount;
  this.totalPages = totalPages;
}
