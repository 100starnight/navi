import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { clickTrigger } from 'ember-power-select/test-support/helpers';

let TEMPLATE = hbs`
<NaviVisualizationConfig::MetricChange
  @request={{this.request}}
  @response={{this.response}}
  @seriesConfig={{this.seriesConfig}}
  @seriesType={{this.seriesType}}
  @onUpdateConfig={{this.onUpdateConfig}}
/>`;

const REQUEST = {
  logicalTable: {
    timeGrain: 'day'
  },
  intervals: [
    {
      start: '2015-12-14 00:00:00.000',
      end: '2015-12-15 00:00:00.000'
    }
  ],
  metrics: [
    {
      metric: 'revenue(currency=USD)'
    },
    {
      metric: 'totalPageViews'
    },
    {
      metric: 'uniqueIdentifier'
    }
  ],
  dimensions: [
    {
      dimension: 'age'
    }
  ]
};

const RESPONSE = {
  rows: [
    {
      dateTime: '2015-12-14 00:00:00.000',
      'age|id': '-3',
      'age|desc': 'All Other',
      uniqueIdentifier: 155191081,
      totalPageViews: 310382162,
      'revenue(currency=USD)': 200
    },
    {
      dateTime: '2015-12-14 00:00:00.000',
      'age|id': '1',
      'age|desc': 'under 13',
      uniqueIdentifier: 55191081,
      totalPageViews: 2072620639,
      'revenue(currency=USD)': 300
    },
    {
      dateTime: '2015-12-14 00:00:00.000',
      'age|id': '2',
      'age|desc': '13 - 25',
      uniqueIdentifier: 55191081,
      totalPageViews: 2620639,
      'revenue(currency=USD)': 400
    },
    {
      dateTime: '2015-12-14 00:00:00.000',
      'age|id': '3',
      'age|desc': '25 - 35',
      uniqueIdentifier: 55191081,
      totalPageViews: 72620639,
      'revenue(currency=USD)': 500
    },
    {
      dateTime: '2015-12-14 00:00:00.000',
      'age|id': '4',
      'age|desc': '35 - 45',
      uniqueIdentifier: 55191081,
      totalPageViews: 72620639,
      'revenue(currency=USD)': 600
    }
  ]
};

const SERIESCONFIG = {
  dimensionOrder: ['age'],
  dimensions: [
    { name: 'All Other', values: { age: '-3' } },
    { name: 'under 13', values: { age: '1' } },
    { name: '13 - 25', values: { age: '2' } },
    { name: '25 - 35', values: { age: '3' } },
    { name: '35 - 45', values: { age: '4' } }
  ],
  metric: { metric: 'totalPageViews' }
};

module('Integration | Component | Config - Metric Change', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.set('request', REQUEST);
    this.set('response', RESPONSE);
    this.set('seriesConfig', SERIESCONFIG);
    this.set('seriesType', 'dimension');
    this.set('onUpdateConfig', () => null);
  });

  test('metric-change options render', async function(assert) {
    assert.expect(4);
    await render(TEMPLATE);
    assert.dom('.metric-change').exists();
    assert.dom('.metric-change__header').exists();
    assert.dom('.metric-change__select').exists();
    await clickTrigger('.metric-change__select');
    assert.dom('.ember-power-select-option').exists({ count: 3 });
  });
});
