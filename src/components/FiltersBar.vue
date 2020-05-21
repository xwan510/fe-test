<template>
  <div>
    <b-button v-b-toggle.sidebar-1 class="fixed-top filter-button btn-md">Filters</b-button>
    <b-sidebar id="sidebar-1" title="Apply Filters" width="250px" shadow>
      <div class="px-4 py-3" id="x">
        <b-form @submit="onSubmit" @reset="onReset" >
          <!-- DA Stage -->
          <b-form-group label="DA Stages">
            <b-form-checkbox-group
              id="stage-input"
              v-model="stages"
              :options="stageOptions"
              plain
              stacked
              name="da-approval"
              @input="onSubmit"
            ></b-form-checkbox-group>
          </b-form-group>
          <!-- Title -->
          <b-form-group label="Title">
            <b-form-input
              id="title-input"
              list="title-list-id"
              placeholder="Enter title"
              v-model="title"
              :formatter="toUpperCase"
              @input="onSubmit"
            ></b-form-input>
            <datalist id="title-list-id">
              <option
                v-for="(title, index) in titleOptions"
                :key="index">{{ title }}
              </option>
            </datalist>
          </b-form-group>
          <!-- Title -->
          <b-form-group label="Value Range">
            <vue-slider
              v-model="valueRange"
              :min="valueOptions ? valueOptions.min : 0"
              :max="valueOptions ? valueOptions.max : 100"
              :interval="valueOptions ? valueOptions.interval : 1"
              @drag-end="onSubmit"
            ></vue-slider>
          </b-form-group>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

export default {
  name: 'FiltersBar',
  components: {
    VueSlider,
  },
  props: {
    stageOptions: Array,
    titleOptions: Array,
    valueOptions: Object,
  },
  data() {
    const minValue = this.valueOptions ? this.valueOptions.min : 0;
    const maxValue = this.valueOptions ? this.valueOptions.max : 100;
    return {
      // Default filter values.
      title: null,
      stages: [],
      valueRange: [minValue, maxValue],
    };
  },
  methods: {
    toUpperCase(value) {
      return value.toUpperCase();
    },
    onSubmit() {
      const data = {
        stages: this.stages,
        title: this.title,
        valueRange: this.valueRange,
      };
      this.$emit('filters-changed', data);
    },
    onReset() {
      this.title = null;
      this.stages = [];
      this.valueRange = [this.valueOptions.min, this.valueOptions.max];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .filter-button {
    width: 160px;
    top: 12%;
    left: 1.5%;
  }
  div /deep/ .col-form-label {
    font-weight: bold;
  }
</style>
