import Vue from "vue"
import {
  mapState
} from "vuex"
import API from '../config/api';
import {checkAuth, timeToDateString} from "../common/utilities";

export default ({app, store, redirect}) => {
  if (Vue.$plugins_facility_installed) {
    return
  }
  Vue.$plugins_facility_installed = true;

  Vue.mixin({
    data() {
      return {
        loadingResources: false,
        totalNum: 0,
        resources: [],
        resourcesPath: '',
        currentResource: null,
        currentResourceId: 0,
        pageNum: 1,
        resourceFilters: {},
        statsFilters: {},
        statsData: [],
        statsName: '',
        statsRange: [],
        startMon: null,
        endMon: null,
        statsByMonth: false,
        loadingStats: false,
        loadingSingleResource: false,
        sortProp: null,
        isAscending: false,
      }
    },
    mounted() {
      if (window.location.href.indexOf('/forbidden') >= 0) {
        return;
      }
      if (store.state.loggedIn) {
        if (!store.state.authorized) {
          redirect('/forbidden');
        }
        // loggedIn && authorized => do nothing
      } else if (!store.state.checkingAuth) {
        checkAuth(app.$axios, store);
      }
    },
    computed: {},
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
        this.pageNum = 1;
        this.resources = [];
        this.resourceFilters = filters || {};
        this.totalNum = 0;
        this.resoucesLoadedCallback = loadedCallback;
        this.sortProp = null;
        this.isAscending = false;
        this.getFilteredResources();
      },
      initCurrentResource(resourcesPath, id, loadedCallback) {
        this.resourcesPath = resourcesPath;
        this.currentResourceId = id;
        this.currentResource = null;
        this.loadingSingleResource = false;
        this.singleResLoadedCallback = loadedCallback;
        this.getSingleResource();
      },
      getFilteredResources() {
        this.loadingResources = true;
        this.$axios.get(API.searchResources(this.resourcesPath, this.resourceFilters, this.pageNum, this.sortProp, this.isAscending)).then(response => {
          this.loadingResources = false;
          this.resources = response.data.data.data || response.data.data;
          this.totalNum = parseInt(response.data.data.total || response.data.total);
          if (this.resoucesLoadedCallback && this.resoucesLoadedCallback instanceof Function) {
            this.resoucesLoadedCallback();
          }
        }).catch(e => {
          this.loadingResources = false;
          this.totalNum = 0;
          console.log(e);
        })
      },
      initStats(statsName, loadedCallback) {
        this.statsName = statsName;
        this.pageStatsNum = 1;
        this.resources = [];
        this.statsFilters = {};
        if (statsName.indexOf('income') >= 0) {
          this.statsFilters.coin_type = 0;
        }
        let startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        this.statsRange = [startDate, new Date()];
        this.statsByMonth = false;
        this.loadingStats = false;
        this.statsLoadedCallback = loadedCallback;
        this.getFilteredStats();
      },
      getFilteredStats() {
        this.loadingStats = true;
        const start = timeToDateString(this.statsRange[0], this.statsByMonth);
        const end = timeToDateString(this.statsRange[1], this.statsByMonth);
        this.$axios.get(API.getStats(this.statsName, this.statsFilters, this.statsByMonth, start, end)).then(response => {
          this.loadingStats = false;
          this.statsData = response.data.data.sort((a, b) =>
            new Date(a.target_time) - new Date(b.target_time)
          );
          if (this.statsLoadedCallback && this.statsLoadedCallback instanceof Function) {
            this.statsLoadedCallback();
          }
        }).catch(e => {
          this.loadingStats = false;
          console.log(e);
        })
      },
      getSingleResource() {
        this.loadingSingleResource = true;
        this.$axios.get(API.singleResource(this.resourcesPath, this.currentResourceId)).then(response => {
          this.loadingSingleResource = false;
          this.currentResource = response.data.data;
          if (this.singleResLoadedCallback && this.singleResLoadedCallback instanceof Function) {
            this.singleResLoadedCallback();
          }
        }).catch(e => {
          this.loadingSingleResource = false;
          console.log(e);
        })
      },
      changePage() {
        // pageNum 要先改变
        Vue.nextTick(this.getFilteredResources);
      },
      changeStatsPage() {
        // pageNum 要先改变
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
      }
    }
  })
}
