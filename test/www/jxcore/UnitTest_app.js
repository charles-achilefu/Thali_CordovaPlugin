/*
 * This file needs to be renamed as app.js when we want to run unit tests
 * in order this to get loaded by the jxcore ready event.
 * This effectively acts as main entry point to the unit test app
 */

'use strict';

if (typeof Mobile === 'undefined') {
  global.Mobile = require('./lib/wifiBasedNativeMock.js')();
}

var testUtils = require('./lib/testUtils');
var ThaliMobile = require('thali/NextGeneration/thaliMobile');
var Promise = require('lie');
var utResult;

Mobile('ExecuteNativeTests').callNative(function (result) {
  utResult = true;
  if (result && result.executed) {
    console.log("Total number of executed tests: ", result.total);
    console.log("Number of passed tests: ", result.passed);
    console.log("Number of failed tests: ", result.failed);
    console.log("Number of ignored tests: ", result.ignored);
    console.log("Total duration: ", result.duration);
    if (result.failed > 0) {
      utResult = false;
    }
  }
});

var isAndroid = process && process.platform === 'android';
console.log("Is Android: ", isAndroid);

if (!utResult && isAndroid) {
  console.log("Failed to execute UT.");
  console.log('****TEST_LOGGER:[PROCESS_ON_EXIT_FAILED]****');
  return;
}

// TODO finish testing here (the node part will be omitted)
console.log('****TEST_LOGGER:[PROCESS_ON_EXIT_SUCCESS]****');
return;

ThaliMobile.getNetworkStatus()
.then(function (networkStatus) {
  var promiseList = [];
  if (networkStatus.wifi === 'off') {
    promiseList.push(testUtils.toggleWifi(true));
  }
  if (networkStatus.bluetooth === 'off') {
    promiseList.push(testUtils.toggleBluetooth(true));
  }
  Promise.all(promiseList)
  .then(function () {
    Mobile('GetDeviceName').callNative(function (name) {
      console.log('My device name is: %s', name);
      testUtils.setName(name);
      // The setImmediate is to avoid this issue:
      // https://github.com/thaliproject/Thali_CordovaPlugin/issues/563
      setImmediate(function () {
        require('./runTests.js');
      });
    });
  });
});

console.log('Unit Test app is loaded');
