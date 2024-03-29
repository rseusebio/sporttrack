import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { RankingTable } from '../../../model/rankingTable';

/**
 * Data source for the FutebolRanking view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class FutebolRankingDataSource extends DataSource<RankingTable> {

  constructor(private paginator: MatPaginator, private sort: MatSort, private data: RankingTable[]) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<RankingTable[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.

    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));

  //  return  observableOf(this.data); 
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-sposicaoe). If you're using server-sposicaoe pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: RankingTable[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-sposicaoe). If you're using server-sposicaoe sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: RankingTable[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'valor': return compare(a.valor, b.valor, isAsc);
        case 'nome': return compare(a.nomeEntidade, b.nomeEntidade, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example posicao/Name columns (for client-sposicaoe sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
