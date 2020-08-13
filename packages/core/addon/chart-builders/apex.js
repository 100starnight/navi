/*
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

/**
 * @typedef {object} requestType
 * @property {array} dimensions - the dimensions of the data
 * @property {array} intervals - the time interval of the data
 * @property {object} logicalTable - the granularity of the time intervals of the data
 * @property {array} metrics - the metrics of the data
 */

/**
 * @typedef {object} returnType
 * @property {array} labels - the labels to be displayed on the chart (if applicable)
 * @property {array} series - the metric series containing data
 */

/**
 * shapes data into apex-friendly format
 * @param {requestType} request
 * @param {array} rows
 * @returns {returnType}
 */
export function shapeData(request, rows) {
  // determine the type of labels for the visualization
  let labelTypes = ['dateTime'];
  if (request.dimensions.length > 0) {
    labelTypes = request.dimensions.map(item => {
      return item.dimension + '|desc';
    });
  }
  // scaffold each of the metrics
  const series = request.metrics.map(item => {
    return { name: item.metric, data: [] };
  });
  // generate labels and populate data for each metric
  let labels = rows.map(row => {
    series.forEach(dataSet => {
      let num = row[dataSet.name];
      // if row has no data for this metric, set to null
      if (num === undefined) {
        num = null;
      }
      dataSet.data.push(Number(num));
    });
    const label = labelTypes.map(labelType => row[labelType]).join(', ');
    return label;
  });
  return { labels: labels, series: series };
}