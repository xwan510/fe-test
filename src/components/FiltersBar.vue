<template>
  <div>
    <b-button v-b-toggle.sidebar-1 class="fixed-top filter-button btn-md">Filters</b-button>
    <b-sidebar id="sidebar-1" title="Apply Filters" width="250px" shadow>
      <div class="px-4 py-3" id="x">
        <b-form @submit="onSubmit" >
          <!-- DA Stage -->
          <b-form-group label="DA Stages">
            <b-form-checkbox-group
              id="stage-input"
              v-model="stages"
              :options="filterOptions.stages"
              plain
              stacked
              name="da-approval"
              @change="onSubmit"
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
                v-for="(title, index) in filterOptions.titles"
                :key="index">{{ title }}
              </option>
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
      // Form values to submit to parent.
      title: null,
      stages: [],
    };
  },
  computed: {
    // Available options to populate the form.
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
      const titles = this.options.titles ? this.options.titles : null;

      const options = {
        stages,
        titles,
      };
      return options;
    },
  },
  methods: {
    toUpperCase(value) {
      return value.toUpperCase();
    },
    onSubmit() {
      const data = {
        stages: this.stages,
        title: this.title,
      };
      this.$emit('filters-changed', data);
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
