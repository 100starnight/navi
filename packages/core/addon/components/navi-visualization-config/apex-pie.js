/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 *
 * {{navi-visualization-config/apex-pie
 *    request=request
 *    response=response
 *    options=chartOptions
 *    onUpdateConfig=(action 'onUpdateChartConfig')
 * }}
 */

import Component from '@glimmer/component';
import { set, action } from '@ember/object';
import { copy } from 'ember-copy';
import { tagName } from '@ember-decorators/component';

@tagName('')
class NaviVisualizationConfigApexPieComponent extends Component {
  /**
   * Method to replace the seriesConfig in visualization config object.
   *
   * @method onUpdateConfig
   * @param {Object} seriesConfig
   */
  @action
  onUpdateSeriesConfig(seriesConfig) {
    const newOptions = copy(this.args.options);
    set(newOptions, 'series.config', seriesConfig);
    this.args.onUpdateConfig(newOptions);
  }
}

export default NaviVisualizationConfigApexPieComponent;
