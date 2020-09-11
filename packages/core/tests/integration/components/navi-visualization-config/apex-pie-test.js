import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render } from '@ember/test-helpers';

let TEMPLATE = hbs`
<NaviVisualizationConfig::ApexPie
  @request={{this.request}}
  @response={{this.response}}
  @options={{this.options}}
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
      metric: 'totalPageViews'
    }
  ],
  dimensions: [
    {
      dimension: 'age'
    }
  ]
};

const RESPONSE = [
  {
    dateTime: '2015-12-14 00:00:00.000',
    'age|id': '-3',
    'age|desc': 'All Other',
    totalPageViews: 310382162
  },
  {
    dateTime: '2015-12-14 00:00:00.000',
    'age|id': '1',
    'age|desc': 'under 13',
    totalPageViews: 2072620639
  },
  {
    dateTime: '2015-12-14 00:00:00.000',
    'age|id': '2',
    'age|desc': '13 - 25',
    totalPageViews: 2620639
  },
  {
    dateTime: '2015-12-14 00:00:00.000',
    'age|id': '3',
    'age|desc': '25 - 35',
    totalPageViews: 72620639
  },
  {
    dateTime: '2015-12-14 00:00:00.000',
    'age|id': '4',
    'age|desc': '35 - 45',
    totalPageViews: 72620639
  }
];

const OPTIONS = {
  series: {
    config: {
      colors: ['#87d812', '#fed800', '#19c6f4', '#9a2ead', '#ff3390'],
      dimensions: [{ id: 'age', name: 'Age' }],
      metrics: [{ id: 'totalPageViews', name: 'Total Page Views' }]
    }
  }
};

module('Integration | Component | navi visualization config - apex-pie', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    this.set('request', REQUEST);
    this.set('response', RESPONSE);
    this.set('options', OPTIONS);
    this.set('onUpdateConfig', () => null);
  });

  test('label options section renders', async function(assert) {
    await render(TEMPLATE);
    assert.dom('.apex-pie-config__label-options-section__header').hasText('Label Options:');
    assert.dom('.apex-pie-config__label-options-section__toggle-legend__label').hasText('Legend Visibility:');
    assert.dom('.apex-pie-config__label-options-section__toggle-legend__switch').exists();
    assert.dom('.apex-pie-config__label-options-section__toggle-data-labels__label').hasText('Show Percentages:');
    assert.dom('.apex-pie-config__label-options-section__toggle-data-labels__switch').exists();
  });

  test('chart colors section renders', async function(assert) {
    await render(TEMPLATE);
    assert.dom('.apex-pie-config__chart-colors-section__header').hasText('Chart Colors:');
    assert.dom('.apex-pie-config__chart-colors-section').exists();
    assert.dom('.color-change-config').exists();
  });
});
