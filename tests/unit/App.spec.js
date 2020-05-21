import { createLocalVue, shallowMount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import * as axios from 'axios';
import App from '@/App.vue';

// A workaround to solve the mapbox-gl node module import bug.
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({}),
}));

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
              Value: '10.000',
            },
          },
        },
        {
          type: 'Feature',
          properties: {
            project: {
              Stage: 'DA Pending',
              Title: 'WESTPAC PLACE',
              Value: '100.000',
            },
          },
        },
        {
          type: 'Feature',
          properties: {
            project: {
              Stage: 'DA Approved',
              Title: 'WOW',
              Value: '1.000',
            },
          },
        },
      ],
    },
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
    axios.get.mockImplementation(() => Promise.reject(new Error('something bad happened')));
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const myWrapper = shallowMount(App, { localVue });
    myWrapper.vm.$nextTick(() => {
      expect(myWrapper.vm.showError).toEqual(true);
      done();
    });
  });

  it('handles empty invalid data', (done) => {
    // To mock failed response, we can remount App with failed mock fetch.
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: {} }));
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    const myWrapper = shallowMount(App, { localVue });
    myWrapper.vm.$nextTick(() => {
      expect(myWrapper.vm.showError).toEqual(true);
      done();
    });
  });

  it('converts geojson to filter options', (done) => {
    wrapper.vm.$nextTick(() => {
      const toMatchData = [{ text: 'DA Approved', value: 'DA Approved' }, { text: 'DA Pending', value: 'DA Pending' }];
      expect(wrapper.vm.stageOptions)
        .toMatchObject(toMatchData);
      done();
    });
  });

  it('converts title to filter options', (done) => {
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.titleOptions)
        .toEqual(expect.arrayContaining(['HELLENIC CLUB', 'WESTPAC PLACE', 'WOW']));
      done();
    });
  });

  it('converts value to filter options', (done) => {
    wrapper.vm.$nextTick(() => {
      const toMatchData = {
        min: 1,
        max: 100,
        interval: 1,
      };
      expect(wrapper.vm.valueOptions)
        .toMatchObject(toMatchData);
      done();
    });
  });

  it('filters source json for title', (done) => {
    wrapper.vm.$nextTick(() => {
      const filters = { title: 'WESTPAC PLACE' };
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
        .toHaveLength(2);
      expect(wrapper.vm.geojsonData.features[0].properties.project.Stage)
        .toEqual('DA Approved');
      done();
    });
  });

  it('filters source json for value range', (done) => {
    wrapper.vm.$nextTick(() => {
      const filters = { valueRange: [10, 50] };
      wrapper.vm.handleFiltersChange(filters);
      expect(wrapper.vm.geojsonData.features)
        .toHaveLength(1);
      expect(wrapper.vm.geojsonData.features[0].properties.project.Value)
        .toEqual('10.000');
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
        .toHaveLength(3);
      done();
    });
  });
});
