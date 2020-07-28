import { setupRenderingTest } from 'ember-qunit';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

const TEMPLATE = hbs`
    {{navi-visualizations/apex-pie
        model=model
        options=options
    }}`;

const Model = A([
  {
    request: {
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
    },
    response: {
      rows: [
        {
          dateTime: '2015-12-14 00:00:00.000',
          'age|id': '-3',
          'age|desc': 'All Other',
          uniqueIdentifier: 155191081,
          totalPageViews: 310382162,
          'revenue(currency=USD)': 200,
          'revenue(currency=CAD)': 300
        },
        {
          dateTime: '2015-12-14 00:00:00.000',
          'age|id': '1',
          'age|desc': 'under 13',
          uniqueIdentifier: 55191081,
          totalPageViews: 2072620639,
          'revenue(currency=USD)': 300,
          'revenue(currency=CAD)': 256
        },
        {
          dateTime: '2015-12-14 00:00:00.000',
          'age|id': '2',
          'age|desc': '13 - 25',
          uniqueIdentifier: 55191081,
          totalPageViews: 2620639,
          'revenue(currency=USD)': 400,
          'revenue(currency=CAD)': 5236
        },
        {
          dateTime: '2015-12-14 00:00:00.000',
          'age|id': '3',
          'age|desc': '25 - 35',
          uniqueIdentifier: 55191081,
          totalPageViews: 72620639,
          'revenue(currency=USD)': 500,
          'revenue(currency=CAD)': 4321
        },
        {
          dateTime: '2015-12-14 00:00:00.000',
          'age|id': '4',
          'age|desc': '35 - 45',
          uniqueIdentifier: 55191081,
          totalPageViews: 72620639,
          'revenue(currency=USD)': 600,
          'revenue(currency=CAD)': 132
        }
      ]
    }
  }
]);

const seriesInfo = {
  type: 'dimension',
  config: {
    metric: {
      metric: 'totalPageViews'
    },
    dimensionOrder: ['age'],
    dimensions: [
      {
        name: 'All Other',
        values: { age: '-3' }
      },
      {
        name: 'Under 13',
        values: { age: '1' }
      }
    ]
  }
};

let MetadataService;
const expectedInfo = {
  labels: ['All Other', 'under 13', '13 - 25', '25 - 35', '35 - 45'],
  totalPageViewData: ['310382162', '2072620639', '2620639', '72620639', '72620639']
};

module('Integration | Components | Apex-Pie', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.set('model', Model);
    this.set('options', {
      type: 'pie-chart',
      version: 1,
      metadata: { series: seriesInfo }
    });
    MetadataService = this.owner.lookup('service:bard-metadata');
    return MetadataService.loadMetadata();
  });

  test('legend of apex-pie chart renders', async function(assert) {
    assert.expect(3);
    await this.render(TEMPLATE);
    console.log(this.element);
    debugger;
    assert.dom('.apexcharts-legend-series').exists({ count: expectedInfo.labels.length });
    assert.dom('.apexcharts-legend-text').hasAttribute('data:default-text');
    let legendText = [];
    this.element.querySelectorAll('.apexcharts-legend-text').forEach(item => {
      legendText.push(item.textContent);
    });
    assert.deepEqual(legendText, expectedInfo.labels);
  });

  test('slices of apex-pie chart render with correct values', async function(assert) {
    assert.expect(expectedInfo.totalPageViewData.length + 1);
    await this.render(TEMPLATE);
    assert.dom('.apexcharts-pie-series').exists({ count: 5 });
    expectedInfo.totalPageViewData.forEach((item, index) => {
      assert.dom(`.apexcharts-pie-slice-${index}`).hasAttribute('data:value', item);
    });
  });
});
