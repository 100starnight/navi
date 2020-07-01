/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import { inject as service } from '@ember/service';
import ActionConsumer from 'navi-core/consumers/action-consumer';
import { RequestActions } from 'navi-reports/services/request-action-dispatcher';
import { featureFlag } from 'navi-core/helpers/feature-flag';

export default ActionConsumer.extend({
  /**
   * @property {Ember.Service} requestActionDispatcher
   */
  requestActionDispatcher: service(),

  actions: {
    /**
     * @action ADD_COLUMN
     * @param route - route that has a model that contains a request property
     * @param columnMetadataModel - metadata model to add
     */
    [RequestActions.ADD_COLUMN]({ currentModel: { request } }, columnMetadataModel) {
      request.addColumnFromMeta(columnMetadataModel);
    },

    [RequestActions.ADD_COLUMN_WITH_PARAMS]({ currentModel: { request } }, columnMetadataModel, parameters) {
      request.addColumnFromMetaWithParams(columnMetadataModel, parameters);
    },

    [RequestActions.REMOVE_COLUMN]({ currentModel: { request } }, columnMetadataModel) {
      request.removeColumnByMeta(columnMetadataModel);
    },

    [RequestActions.REMOVE_COLUMN_WITH_PARAMS]({ currentModel: { request } }, columnMetadataModel, parameters) {
      request.removeColumnByMeta(columnMetadataModel, parameters);
    },

    [RequestActions.REMOVE_COLUMN_FRAGMENT]({ currentModel: { request } }, columnFragment) {
      request.removeColumn(columnFragment);
    },

    [RequestActions.UPDATE_COLUMN_FRAGMENT_WITH_PARAMS](route, columnFragment, parameterId, parameterKey) {
      columnFragment.updateParameters({ [parameterId]: parameterKey });
    },

    [RequestActions.ADD_METRIC_FILTER](route, metricMetadataModel, parameters) {
      // Metric filter can't exist without the metric present in the request

      if (
        featureFlag('enableRequestPreview') &&
        route.currentModel.request.columns.find(
          column => column.type === 'metric' && column.columnMeta === metricMetadataModel
        )
      ) {
        // When adding a metric filter with the requestPreview, users can add multiple of the same metric
        // So if the metric already exists we assume they don't want to add it again
        return;
      }

      if (parameters) {
        this.requestActionDispatcher.dispatch(
          RequestActions.ADD_COLUMN_WITH_PARAMS,
          route,
          metricMetadataModel,
          parameters
        );
      } else {
        this.requestActionDispatcher.dispatch(RequestActions.ADD_COLUMN, route, metricMetadataModel);
      }
    },

    [RequestActions.DID_UPDATE_TABLE](route, table) {
      const {
        currentModel: { request }
      } = route;
      const { metrics, dimensions } = table;

      /*
       * .toArray() is used to clone the array, otherwise removing a column while
       * iterating over `request.columns` causes problems
       */
      request.columns.toArray().forEach(column => {
        if (![...metrics, dimensions].includes(column.columnMeta)) {
          this.requestActionDispatcher.dispatch(RequestActions.REMOVE_COLUMN, route, column.columnMeta);
        }
      });
    }
  }
});
