export interface ISortFilterConfig {
  sortKey: string; // e.g. `sort`, `sort_by`, etc.
  sortDirectionKey: {
    /**
     * if there is a delimiter in the sort direction, include it here
     * e.g. given `asc:name` then the delimiter would be `:`
     *      so the ascending sortDirectionKey would be `asc:`
     */
    ascending: string;
    descending: string;
  };

  /**
   * filterKeys will be an array of strings representing all the valid properties in the data objects
   * that can be filtered on.
   * for now these must match the actual property names to be filtered.
   * e.g. given the following object
          {
            foo: 'foo val',
            bar: 'bar val',
            baz: 'baz val',
          }
          appropriate values for filterKeys would be ['foo', 'bar', 'baz']
          whereas something like: ['foo_filter'] would not work
   */
  filterKeys: string[];
  // TODO: pagination to be implemented at a later time
  limitKey: string;
  offsetKey: string;
}

export const defaultSortFilterConfig: ISortFilterConfig = {
  sortKey: '',
  sortDirectionKey: {
    ascending: '',
    descending: '',
  },
  filterKeys: [],
  limitKey: '',
  offsetKey: '',
};
