import FiltersBar from '@/components/FiltersBar.vue';
import { createLocalVue, mount } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

const mountFiltersBar = (options) => {
  // Install bootstrap-vue components, otherwise it complains about custom elements.
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  return mount(FiltersBar, {
    propsData: options,
    localVue,
  });
};

describe('FiltersBar.vue', () => {
  it('renders correctly', () => {
    const options = {
      stageOptions: ['stage1', 'stage2'],
      titleOptions: ['title1', 'title2'],
    };
    const wrapper = mountFiltersBar(options);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders props.stagesOptions when passed', () => {
    const options = {
      stageOptions: ['stage1', 'stage2'],
    };
    const wrapper = mountFiltersBar(options);
    expect(wrapper.text()).toMatch('stage2');
  });

  it('renders props.titleOptions when passed', () => {
    const options = {
      titleOptions: ['title1', 'title2'],
    };
    const wrapper = mountFiltersBar(options);
    expect(wrapper.text()).toMatch('title1');
  });

  it('emits filter values when form submits', async () => {
    const options = {
      titleOptions: ['title1', 'title2'],
    };
    const wrapper = mountFiltersBar(options);
    wrapper.find('form').trigger('submit');

    // Well, lodash debounce doesn't use Promise, so we have to just wait it out.
    await new Promise((r) => setTimeout(r, 500));

    expect(wrapper.emitted('filters-changed'))
      .toHaveLength(1);
  });

  it('emits correct filter values for title', async () => {
    const options = {
      titleOptions: ['title1', 'title2'],
    };
    const wrapper = mountFiltersBar(options);
    wrapper.setData({ title: 'title1' });
    wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 500));

    expect(wrapper.emitted('filters-changed')[0][0].title)
      .toMatch('title1');
  });

  it('emits correct filter values for stage', async () => {
    const options = {
      stageOptions: ['stage1', 'stage2'],
    };
    const wrapper = mountFiltersBar(options);
    wrapper.setData({ stages: ['stage1', 'stage2'] });
    wrapper.find('form').trigger('submit');

    await new Promise((r) => setTimeout(r, 500));

    expect(wrapper.emitted('filters-changed')[0][0].stages)
      .toEqual(expect.arrayContaining(['stage1', 'stage2']));
  });
});
