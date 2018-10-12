import Vue from 'vue';
import API from '../config/api';
import {getDate, toBackendTimeStamp, toFrontendDate} from '../common/utilities';
import {reportError} from './sentry';

export default ({app, store, route, redirect}) => {
  if (Vue.$plugins_facility_installed) {
    return;
  }
  Vue.$plugins_facility_installed = true;

  Vue.mixin({
    data() {
      const page = parseInt(route.query.page) || 1;
      const limit = 30;
      return {
        loadingResources: false,
        totalNum: limit * page,
        resources: [],
        resourcesPath: '',
        currentResource: null,
        currentResourceId: 0,
        pageNum: page,
        resourceFilters: {},
        statsFilters: {},
        statsData: [],
        statsName: '',
        resourcesDateRange: null,
        statsRange: [],
        statsPeriod: 'daily',
        loadingStats: false,
        loadingSingleResource: false,
        sortProp: null,
        isAscending: false,
      };
    },
    computed: {
      isSuperAdmin() {
        return this.$store.getters['user/isSuperAdmin'];
      }
    },
    methods: {
      scrollToElement: function (elementId) {
        let scrollY = 0;
        if (elementId && document.getElementById(elementId)) {
          scrollY = document.getElementById(elementId).offsetTop;
        }
        window.scrollTo(0, scrollY);
      },
      initResources(resourcesPath, loadedCallback, filters) {
        this.resourcesPath = resourcesPath;
        this.pageNum = parseInt(this.$route.query.page) || 1;
        this.resources = [];
        this.resourceFilters = filters || {};
        this.totalNum = this.pageNum * 30;
        this.resourcesDateRange = null;
        this.resoucesLoadedCallback = loadedCallback;
        this.sortProp = null;
        this.isAscending = false;
        this.getFilteredResources();
      },
      initSingleResource(resourcesPath, id, loadedCallback) {
        this.resourcesPath = resourcesPath;
        this.currentResourceId = id;
        this.currentResource = null;
        this.loadingSingleResource = false;
        this.singleResLoadedCallback = loadedCallback;
        this.getSingleResource();
      },
      initStats(statsName, loadedCallback, filters = {}) {
        this.statsName = statsName;
        this.resources = [];
        this.statsFilters = filters;
        if (this.$route.query.start) {
          this.statsRange = [toFrontendDate(this.$route.query.start), toFrontendDate(this.$route.query.end)];
        } else {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          this.statsRange = [startDate, new Date()];
        }
        this.statsPeriod = 'daily';
        this.loadingStats = false;
        this.statsLoadedCallback = loadedCallback;
        this.getFilteredStats();
      },
      backendStamp(date) {
        return Math.floor(date.getTime() / 1000);
      },
      getFilteredResources() {
        this.loadingResources = true;
        const range = this.resourcesDateRange && this.resourcesDateRange[0] ? {
          start: this.backendStamp(this.resourcesDateRange[0]),
          end: this.backendStamp(this.resourcesDateRange[1]),
        } : null;
        this.$axios.get(
          API.searchResources(
            this.resourcesPath, this.resourceFilters,
            this.pageNum, this.sortProp, this.isAscending,
            range)
        ).then(response => {
          this.loadingResources = false;
          this.resources = response.data.data.data || response.data.data;
          this.totalNum = parseInt(response.data.data.total || response.data.total) || 0;
          if (this.resoucesLoadedCallback && this.resoucesLoadedCallback instanceof Function) {
            this.resoucesLoadedCallback(response);
          }
        }).catch(e => {
          this.loadingResources = false;
          this.totalNum = 0;
          if (this.resoucesLoadedCallback && this.resoucesLoadedCallback instanceof Function) {
            this.resoucesLoadedCallback(e);
          }
          reportError(e);
        });
      },
      getFilteredStats() {
        this.loadingStats = true;
        const start = toBackendTimeStamp(getDate(this.statsRange[0]));
        const end = toBackendTimeStamp(getDate(this.statsRange[1]));
        this.$router.replace({
          query: {...this.$route.query, start, end, page: this.pageNum, ...this.statsFilters}
        });
        this.$axios.get(API.getStats(this.statsName, this.statsFilters, this.statsPeriod, start, end, this.pageNum, this.limit)).then(response => {
          this.loadingStats = false;
          const data = response.data.data;
          this.statsData = data.data;
          this.totalNum = data.total;
          if (this.statsLoadedCallback && this.statsLoadedCallback instanceof Function) {
            this.statsLoadedCallback(response);
          }
        }).catch(e => {
          this.loadingStats = false;
          if (this.statsLoadedCallback && this.statsLoadedCallback instanceof Function) {
            this.statsLoadedCallback(e);
          }
          reportError(e);
        });
      },
      getSingleResource() {
        this.loadingSingleResource = true;
        this.$axios.get(API.singleResource(this.resourcesPath, this.currentResourceId)).then(response => {
          this.loadingSingleResource = false;
          this.currentResource = response.data.data;
          if (this.singleResLoadedCallback && this.singleResLoadedCallback instanceof Function) {
            this.singleResLoadedCallback(response);
          }
        }).catch(e => {
          this.loadingSingleResource = false;
          if (this.singleResLoadedCallback && this.singleResLoadedCallback instanceof Function) {
            this.singleResLoadedCallback(e);
          }
          reportError(e);
        });
      },
      changePage() {
        // pageNum 要先改变
        this.$router.replace({
          query: {...this.$route.query, page: this.pageNum}
        });
        Vue.nextTick(this.getFilteredResources);
      },
      changeStatsPage() {
        Vue.nextTick(this.getFilteredStats);
      },
      changeStatsRange() {
        this.pageNum = 1;
        Vue.nextTick(this.getFilteredStats);
      },
      confirmAction(message, accepted, refused) {
        this.$confirm(message)
          .then(_ => {
            accepted();
          })
          .catch(_ => {
            if (refused && refused instanceof Function) {
              refused();
            }
          });
      },
      sortChange(sort) {
        this.sortProp = sort.prop;
        this.isAscending = sort.order === 'ascending';
        this.getFilteredResources();
      },
    }
  });
};
