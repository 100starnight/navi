/* eslint ember/routes-segments-snake-case: "off" */
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('directory', function() {
    this.route('my-directory');
  });

  this.route('reports', function() {
    this.route('new');
    this.route('report', { path: '/:reportId'}, function() {
      this.route('clone');
      this.route('save-as');
      this.route('invalid');
      this.route('new');
      this.route('view');
      this.route('unauthorized');
    });
  });

  this.route('dashboards', function() {
    this.route('new');
    this.route('dashboard', { path: '/:dashboardId'}, function() {
      this.route('view');
      this.route('clone');

      this.route('widgets', function() {
        this.route('add');
        this.route('new');
        this.route('widget', { path: '/:widgetId'}, function() {
          this.route('clone-to-report');
          this.route('new');
          this.route('view');
          this.route('invalid');
        });
      });
    });
  });
});

export default Router;