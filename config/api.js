export default {
  searchResources: (resources, filters, pageNum, sortProp, isAscending) => {
    let queryString = `/${resources}?page=${pageNum}&limit=10`;
    if (isAscending) {
      queryString += '&order=asc'
    }
    if (sortProp) {
      queryString += '&sort_by=' + sortProp
    }
    if (filters) {
      for (let prop in filters) {
        if (filters.hasOwnProperty(prop) && filters[prop] !== undefined && filters[prop] !== null && filters[prop] !== '') { // can be 0
          queryString += '&' + prop + '=' + encodeURIComponent(filters[prop]);
        }
      }
    }
    return queryString;
  },
  getStats: (resources, filters, statsByMonth, start, end) => {
    let queryString = `/${resources}/${statsByMonth ? 'monthly' : 'daily'}?start_date=${start}&end_date=${end}`;
    if (filters) {
      for (let prop in filters) {
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
