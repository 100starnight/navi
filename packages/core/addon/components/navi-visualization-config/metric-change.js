/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * <NaviVisualizationConfig::MetricChange
 *   @request={{@request}}
 *   @response={{@response}}
 *   @seriesConfig={{readonly @options.series.config}}
 *   @seriesType={{readonly @options.series.type}}
 *   @onUpdateConfig={{this.onUpdateSeriesConfig}}
 * />
 */

import Component from '@glimmer/component';
import { set, computed, action } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { copy } from 'ember-copy';
import { tagName } from '@ember-decorators/component';

@tagName('')
class NaviVisualizationConfigMetricChangeComponent extends Component {
  /**
   * @property {Array} metrics
   */
  @computed('request')
  get metrics() {
    return this.args.request.metrics;
  }

  /**
   * @property {Object} selectedMetric
   */
  @readOnly('args.seriesConfig.metric') selectedMetric;

  /**
   * @method onUpdateChartMetric
   * @param {Object} metric
   */
  @action
  onUpdateChartMetric(metric) {
    const newConfig = copy(this.args.seriesConfig);
    set(newConfig, `metric`, metric);
    this.args.onUpdateConfig(newConfig);
  }
}

export default NaviVisualizationConfigMetricChangeComponent;
