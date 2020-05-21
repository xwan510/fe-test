# Cool Map with Vue + Mapbox
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/xwan510/fe-test/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/xwan510/fe-test/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/xwan510/fe-test/badges/build.png?b=master)](https://scrutinizer-ci.com/g/xwan510/fe-test/build-status/master)
[![Build Status](https://travis-ci.com/xwan510/fe-test.svg?branch=master)](https://travis-ci.com/xwan510/fe-test)

This is a test project using Vue + Mapbox to showcase map interactions with filters using geojson data source.

## Design considerations

## Installation

```
npm install
```

#### Configuration

- Copy file `.env.example` to `.env`

- Edit .env for Postgres DB connection

- Install project dependencies

```
composer install
```

#### DB setup
Run below command to create DB schema and seed DB with sample data.

CSV files in database/csvs are imported to seed DB.
```
php artisan migrate:fresh --seed
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

