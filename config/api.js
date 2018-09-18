export default {
  searchResources: (resources, filters, pageNum, sortProp, isAscending, dateRange) => {
    let queryString = `/${resources}?page=${pageNum}&limit=10`;
    if (isAscending) {
      queryString += '&order=asc';
    }
    if (dateRange) {
      queryString += `&start_time=${dateRange.start}&end_time=${dateRange.end}`;
    }
    if (sortProp) {
      queryString += '&sort_by=' + sortProp;
    }
    if (filters) {
      for (const prop in filters) {
        if (filters.hasOwnProperty(prop) && filters[prop] !== undefined && filters[prop] !== null && filters[prop] !== '') { // can be 0
          queryString += '&' + prop + '=' + encodeURIComponent(filters[prop]);
        }
      }
    }
    return queryString;
  },
  getStats: (resources, filters, period, start, end, page=1, limit=10) => {
    let queryString = `/${resources}?period=${period}&start_time=${start}&end_time=${end}&page=${page}&limit=${limit}`;
    if (filters) {
      for (const prop in filters) {
        if (filters.hasOwnProperty(prop) && filters[prop] !== undefined && filters[prop] !== null && filters[prop] !== '') { // can be 0
          queryString += '&' + prop + '=' + encodeURIComponent(filters[prop]);
        }
      }
    }
    return queryString;
  },
  singleResource: (resources, id) => {
    return `/${resources}/${id}`;
  },
  combinedResources: (primary, id, combined) => {
    return `/${primary}/${id}/${combined}`;
  },
};
