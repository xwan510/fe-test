// A workaround to solve the mapbox-gl node module import bug.
import Map from '@/components/Map.vue';
import { shallowMount } from '@vue/test-utils';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Mapbox: () => ({}),
}));

let wrapper;
const geojsonData = {
  features: [
    {
      type: 'Feature',
      properties: {
        project: {
          Stage: 'DA Approved',
          Title: 'HELLENIC CLUB',
        },
      },
    },
    {
      type: 'Feature',
      properties: {
        project: {
          Stage: 'DA Pending',
          Title: 'WESTPAC PLACE',
        },
      },
    },
  ],
};
beforeEach(() => {
  wrapper = shallowMount(Map, {
    propsData: { geojsonData },
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('Map.vue', () => {
  it('converts props.geojsonData to computed data', () => {
    const toMatchData = {
      type: 'geojson',
      data: geojsonData,
    };
    expect(wrapper.vm.geoJsonSource).toMatchObject(toMatchData);
  });

  it('computes layer config', () => {
    expect(wrapper.vm.geoJsonlayer).toBeTruthy();
  });
});
