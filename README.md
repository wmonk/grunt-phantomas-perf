# grunt-phantomas-perf

> grunt-phantomas-perf is a grunt plugin for asserting against metrics generated with [Phantomas](https://github.com/macbre/phantomas);

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev grunt-phantomas-perf
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-phantomas-perf');
```

## The "grunt-phantomas-perf" task

### Overview
In your project's Gruntfile, add a section named `phantomasPerf` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  phantomasPerf: {
    my_site: {
      options: {
        url: 'http://google.com',
        trials: 5,
        timeout: 25,
        assertions: {
            domInteractive: 1000,
            domContentLoadedEnd: 1400,
            domComplete: 2000
        }
      }
    },
  },
})
```
