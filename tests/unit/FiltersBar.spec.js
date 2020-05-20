import FiltersBar from '@/components/FiltersBar.vue';
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

const mountFiltersBar = (options) => {
  // Install bootstrap vue, otherwise it complains about custom elements.
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  return mount(FiltersBar, {
    propsData: { options },
    localVue
  });
}

describe('FiltersBar.vue', () => {

  it('renders props.options.stages when passed', () => {
    const options = {
      stages: ['stage1', 'stage2'],
    };
    const wrapper = mountFiltersBar(options);
    expect(wrapper.text()).toMatch('stage2');
  });

  it('renders props.options.titles when passed', () => {
    const options = {
      titles: ['title1', 'title2'],
    };
    const wrapper = mountFiltersBar(options);
    expect(wrapper.text()).toMatch('title1');
  });

  it('emits filter values when form submits', async () => {
    const options = {
      titles: ['title1', 'title2'],
    };
    const wrapper = mountFiltersBar(options);
    wrapper.find('form').trigger("submit");
    expect(wrapper.emitted('filters-changed')).toHaveLength(1);
  });
});
