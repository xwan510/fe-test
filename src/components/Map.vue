<template>
  <div class='map'>
    <MglMap :accessToken="accessToken" :mapStyle="mapStyle" :center="center" :zoom="zoom">
      <!-- Adding navigation control -->
      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />
      <!-- Adding GeoJSON layer -->
      <MglGeojsonLayer
        :sourceId="sourceId"
        :source="geoJsonSource"
        :layerId="layerId"
        :layer="geoJsonlayer"
      />
    </MglMap>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl';
import {
  MglMap,
  MglNavigationControl,
  MglGeojsonLayer,
  MglGeolocateControl,
} from 'vue-mapbox';
import * as Constants from '../constants';

// Map component.
export default {
  name: 'Map',
  components: {
    MglMap,
    MglNavigationControl,
    MglGeojsonLayer,
    MglGeolocateControl,
  },
  props: {
    geojsonData: Object,
  },
  data() {
    return {
      accessToken: Constants.ACCESS_TOKEN,
      mapStyle: Constants.MAP_STYLE,
      center: Constants.CENTER,
      zoom: Constants.ZOOM,
      sourceId: Constants.SOURCEID,
      layerId: Constants.LAYERID,
    };
  },
  computed: {
    geoJsonSource() {
      const source = {
        type: 'geojson',
        data: this.geojsonData,
      };
      return source;
    },
    geoJsonlayer() {
      const config = {
        id: Constants.SOURCEID,
        type: 'symbol',
        source: Constants.SOURCEID,
        layout: {
          // Just use icon that is shipped with mapbox.
          'icon-image': 'embassy-15',
          // get the title name from the source's "title" property
          'text-field': ['get', 'Title', ['get', 'project']],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
      };
      return config;
    },
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  },
  destroyed() {
  },
  methods: {
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map {
    height: 80vh;
  }
</style>
