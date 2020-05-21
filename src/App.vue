<template>
  <div id="app">
    <header id="app-header">
      <h1>Cool Map</h1>
    </header>
    <main>
      <!-- Filters Bar -->
      <FiltersBar
        v-if="filterOptions"
        :options="filterOptions"
        @filters-changed="handleFiltersChange"
      />
      <!-- Map -->
      <Map :geojsonData="geojsonData" />
      <!-- Error modal -->
      <b-modal id="modal-1" title="Error" ok-only v-model="showError">
        <p class="my-4">Failed to load geojson data.</p>
      </b-modal>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import FiltersBar from './components/FiltersBar.vue';
import Map from './components/Map.vue';
import { GEOJSON_LOCATION } from './constants';

export default {
  name: 'App',
  components: {
    FiltersBar,
    Map,
  },
  data() {
    return {
      filterOptions: null,
      geojsonData: null,
      // A copy of original data so filters can be reset.
      originalGeojsonData: null,
      showError: false,
    };
  },
  methods: {
    handleFiltersChange(filters) {
      // Now filter data and update the map.
      this.geojsonData.features = this.originalGeojsonData.features.filter((item) => {
        if (filters.stages && filters.stages.length > 0) {
          if (filters.stages.includes(item.properties.project.Stage) === false) {
            return false;
          }
        }
        if (filters.title) {
          if (item.properties.project.Title.startsWith(filters.title) === false) {
            return false;
          }
        }
        return true;
      });
    },
  },
  async mounted() {
    // Fetch geojson file.
    let response = null;
    try {
      response = await axios.get(GEOJSON_LOCATION);
    } catch (error) {
      this.showError = true;
      return;
    }

    // Save a original copy of data for filters reset later.
    this.originalGeojsonData = { ...response.data };

    // Pass data to map component to render.
    this.geojsonData = response.data;

    // Get stages filter options. e.g DA approval.
    const stages = {};
    response.data.features.forEach((element) => {
      stages[element.properties.project.Stage] = true;
    });
    // Get stages filter options. e.g DA approval.
    const titles = {};
    response.data.features.forEach((element) => {
      titles[element.properties.project.Title] = true;
    });
    // Set all filter options to the bar.
    this.filterOptions = {
      stages: Object.keys(stages),
      titles: Object.keys(titles),
    };
  },
};
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  #app #app-header {
    text-align: center;
    padding: 1%;
  }
</style>
