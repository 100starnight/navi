/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 * <NaviVisualizations::ApexBar
 *   @model={{this.model}}
 *   @options={{this.metricOptions}}
 * />
 */
import NaviVisualizationsApexPie from './apex-line';
import { computed } from '@ember/object';
import numeral from 'numeral';

export default class NaviVisualizationsApexBar extends NaviVisualizationsApexPie {
  /**
   * @properties {array} - array of objects with ApexCharts-formatted data
   */
  @computed('data')
  get chartOptions() {
    return {
      chart: {
        type: 'bar'
      },
      series: this.series,
      xaxis: {
        categories: this.labels
      },
      yaxis: {
        type: 'datetime',
        labels: {
          formatter: function(value) {
            return numeral(value).format('0.00a');
          }
        }
      },
      dataLabels: {
        enabled: false
      }
    };
  }
}
