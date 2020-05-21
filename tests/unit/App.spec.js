import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import * as axios from "axios";

// A workaround to solve the mapbox-gl node module import bug.
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({}),
}));
import App from '@/App.vue';

let wrapper;
jest.mock('axios');

beforeEach(() => {
  // Mocking axios fetch.
  const mockGeojson = {
    status: 200,
    data: {
      features: [
        {
          type: 'Feature',
          properties: {
            project: {
              Stage: 'DA Approved',
              Title: 'HELLENIC CLUB',
            }
          }
        },
        {
          type: 'Feature',
          properties: {
            project: {
              Stage: 'DA Pending',
              Title: 'WESTPAC PLACE',
            }
          }
        },
      ]
    }
  };
  axios.get.mockResolvedValue(mockGeojson);

  // Mount App with bootstrap elements.
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  wrapper = shallowMount(App, {
    localVue,
  });
});

afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks(); 
});


// Tests start.
describe('App.vue', () => {

  it('fetches geojson file when mounted', (done) => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.geojsonData).toBeTruthy();
      done();
    });
  });

  it('handles failed fetch', (done) => {
    // To mock failed response, we can remount App with failed mock fetch.
    axios.get.mockImplementation(() => Promise.reject({ status: 404, data: {} }));
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const wrapper = shallowMount(App, { localVue });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.showError).toEqual(true);
      done();
    });
  });

  it('converts geojson to filter options', (done) => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.filterOptions.stages)
        .toEqual(expect.arrayContaining(['DA Approved', 'DA Pending']));
      done();
    });
  });

  it('converts title to filter options', (done) => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.filterOptions.titles)
        .toEqual(expect.arrayContaining(['HELLENIC CLUB', 'WESTPAC PLACE']));
      done();
    });
  });

  it('filters source json for title', (done) => {
    wrapper.vm.$nextTick(() => {
      const filters = { title: 'WESTPAC PLACE'};
      wrapper.vm.handleFiltersChange(filters);
      expect(wrapper.vm.geojsonData.features)
        .toHaveLength(1);
      expect(wrapper.vm.geojsonData.features[0].properties.project.Title)
        .toEqual('WESTPAC PLACE');
      done();
    });
  });

  it('filters source json for stage', (done) => {
    wrapper.vm.$nextTick(() => {
      const filters = { stages: ['DA Approved'] };
      wrapper.vm.handleFiltersChange(filters);
      expect(wrapper.vm.geojsonData.features)
        .toHaveLength(1);
      expect(wrapper.vm.geojsonData.features[0].properties.project.Stage)
        .toEqual('DA Approved');
      done();
    });
  });

  it('restores to original source when no filters is provided', (done) => {
    wrapper.vm.$nextTick(() => {
      const filters = { title: 'WESTPAC PLACE' };
      wrapper.vm.handleFiltersChange(filters);
      expect(wrapper.vm.geojsonData.features)
        .toHaveLength(1);
      // Set a new empty filter, it should restore original source.
      const newfilters = {};
      wrapper.vm.handleFiltersChange(newfilters);
      expect(wrapper.vm.geojsonData.features)
        .toHaveLength(2);
      done();
    });
  });
});
