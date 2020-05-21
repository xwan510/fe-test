# Cool Map with Vue + Mapbox
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/xwan510/fe-test/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/xwan510/fe-test/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/xwan510/fe-test/badges/build.png?b=master)](https://scrutinizer-ci.com/g/xwan510/fe-test/build-status/master)

This is a test project using Vue + Mapbox to showcase map interactions with geojson source data.
Live site is deployed to netlify [here](https://5ec66560cc94270006009900--serene-shirley-97e865.netlify.app/)

## Design considerations

There are only 3 components
- App.vue is the parent component. It handles fetching geojson file and passing data to FiltersBar and Map
- FiltersBar.vue shows filters inputs
- Map.vue shows Mapbox

Vuex is not used since interaction is pretty simple.

Fetching geojson file is a async URL request. Filters toggle button is only visible when loading of geojson file is finished. I could use a spinner here, but the map loads pretty gracefully while user waiting which makes me think no need of spinner.

In reality, geojson file might be pretty large. Performance and UX must be considered.

In FiltersBar.vue, filter values will be emitted to parent App.vue. Debouncing strategy is used to avoid intensive unnecessary applying of filters to map, such as user dragging slider bar.

Mobile responsive design is tested. HTML 5 sematic syntax is used.

## Installation

```
npm install
```

## Testing

#### Start web server

```
npm run serve
```

#### Run unit tests

```
npm run test:unit
```

