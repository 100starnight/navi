/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import Ember from 'ember';
import ActionConsumer from 'navi-core/consumers/action-consumer';
import { ReportActions } from 'navi-reports/services/report-action-dispatcher';
import keyBy from 'lodash/keyBy';

const { assign, get, set } = Ember;

export default ActionConsumer.extend({

  actions: {
    /**
     * @action UPDATE_TABLE_COLUMN_ORDER
     * @param {Object} route - report route
     * @param {Object} newColumnOrder - new column order to replace old
     */
    [ReportActions.UPDATE_TABLE_COLUMN_ORDER]({ currentModel:report }, newColumnOrder) {
      Ember.assert('Visualization must be a table', get(report, 'visualization.type') === 'table');
      let visualizationMetadata = get(report, 'visualization.metadata'),
          metrics = get(report, 'request.metrics'),
          metricIndex = keyBy(metrics.toArray(), metric => get(metric, 'canonicalName')),
          reorderedMetrics = newColumnOrder
            .filter(column => column.type === 'metric')
            .map(column => metricIndex[column.field]);

      set(report, 'visualization.metadata',
        assign({}, visualizationMetadata, { columns: newColumnOrder})
      );

      set(report, 'request.metrics', reorderedMetrics);
    }
  }
});
