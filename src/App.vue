<template>
  <div id="app">
    <header id="app-header">
      <h1>Cool Map</h1>
    </header>
    <main>
      <!-- Filters Bar -->
      <FiltersBar
        v-if="stageOptions && titleOptions && valueOptions"
        :stageOptions="stageOptions"
        :titleOptions="titleOptions"
        :valueOptions="valueOptions"
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
      stageOptions: null,
      titleOptions: null,
      valueOptions: null,
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
        const project = { ...item.properties.project };
        if (filters.stages && filters.stages.length > 0) {
          if (filters.stages.includes(project.Stage) === false) {
            return false;
          }
        }
        if (filters.title) {
          if (project.Title.startsWith(filters.title) === false) {
            return false;
          }
        }
        if (filters.valueRange) {
          const currentValue = parseInt(project.Value, 10);
          if (currentValue < filters.valueRange[0] || currentValue > filters.valueRange[1]) {
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

    // Basic structure check.
    if (!response.data || !response.data.features || !response.data.features.length) {
      this.showError = true;
      return;
    }

    // Save a original copy of data for filters reset later.
    this.originalGeojsonData = { ...response.data };

    // Pass data to map component to render.
    this.geojsonData = response.data;

    // Set stages filter options. e.g DA approval.
    const stages = {};
    response.data.features.forEach((element) => {
      // Find unique stage.
      stages[element.properties.project.Stage] = true;
    });
    // Convert it to array.
    const sortedStages = Object.keys(stages);
    sortedStages.sort();
    this.stageOptions = sortedStages.map((element) => ({
      text: element,
      value: element,
    }));

    // Set stages filter options. e.g DA approval.
    const titles = {};
    response.data.features.forEach((element) => {
      titles[element.properties.project.Title] = true;
    });
    this.titleOptions = Object.keys(titles);
    this.titleOptions.sort();

    // Set value range filter options.
    const values = { min: null, max: null, interval: 1 };
    if (response.data.features[0].properties.project.Value) {
      values.min = parseInt(response.data.features[0].properties.project.Value, 10);
      values.max = values.min;
    }
    response.data.features.forEach((element) => {
      const value = parseInt(element.properties.project.Value, 10);
      if (value < values.min) {
        values.min = value;
      }
      if (value > values.max) {
        values.max = value;
      }
    });
    this.valueOptions = values;
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
    text-align: left;
    padding: 1%;
    height: 8vh;
  }
</style>
