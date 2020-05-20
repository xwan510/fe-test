<template>
  <div>
    <b-button v-b-toggle.sidebar-1 class="fixed-top filter-button btn-md">Filters</b-button>
    <b-sidebar id="sidebar-1" title="Apply Filters" width="250px" shadow>
      <div class="px-4 py-3" id="x">
        <b-form @submit="onSubmit" >
          <!-- DA Stage -->
          <b-form-group label="DA Stages">
            <b-form-checkbox-group
              v-model="filterValues.stages"
              :options="filterOptions.stages"
              plain
              stacked
              name="da-approval"
            ></b-form-checkbox-group>
          </b-form-group>
          <!-- Title -->
          <b-form-group label="Title">
            <b-form-input
              list="title-list-id"
              placeholder="Enter title"
              v-model="filterValues.title"
              :formatter="toUpperCase"
            ></b-form-input>
            <datalist id="title-list-id">
              <option v-for="(title, index) in filterOptions.titles" :key="index">{{ title }}</option>
            </datalist>
          </b-form-group>
        </b-form>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: 'FiltersBar',
  props: {
    options: Object,
  },
  data() {
    return {
      filterValues: {
        stages: [],
        title: null,
      },
    };
  },
  computed: {
    filterOptions() {
      // DA Approval stages.
      let stages = null;
      if (this.options.stages) {
        stages = this.options.stages.map((element) => ({
          text: element,
          value: element,
        }));
      }
      // Titles.
      let titles = this.options.titles ? this.options.titles : null;

      const options = {
        stages,
        titles,
      };
      return options;
    },
  },
  watch: {
    filterValues: {
      handler(data) {
        // If any filters changes, pass it to App.
        if (data) {
          this.emitChanges(data);
        }
      },
      deep: true, // Deep check for every value changes.
    },
  },
  methods: {
    toUpperCase(value) {
      return value.toUpperCase();
    },
    emitChanges(data) {
      this.$emit('filters-changed', data);
    },
    onSubmit() {
      this.emitChanges(this.filterValues);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .filter-button {
    width: 150px;
    top: 10%;
    left: 1.5%;
  }
  div /deep/ .col-form-label {
    font-weight: bold;
  }
</style>
