import _ from 'lodash';

import {BaseVendor} from './base.js';

export class LambdatestVendor extends BaseVendor {
  constructor(server, sessionCaps) {
    super(server, sessionCaps);
    this.vendor = server.lambdatest;
    this.vendorName = 'LambdaTest';
    this.vendorOptionsCap = 'lt:options';
  }

  /**
   * @override
   */
  async setProperties() {
    const port = process.env.LAMBDATEST_PORT || 443;
    this.setCommonProperties({
      host: process.env.LAMBDATEST_HOST || 'mobile-hub.lambdatest.com',
      path: '/wd/hub',
      https: parseInt(port, 10) === 443,
      port,
    });

    this.setAccessProperties({
      username: {
        value: this.vendor.username || process.env.LAMBDATEST_USERNAME,
        validateAs: 'Username',
      },
      accessKey: {
        value: this.vendor.accessKey || process.env.LAMBDATEST_ACCESS_KEY,
        validateAs: 'Access Key',
      },
    });

    const proxyUrl = _.isUndefined(this.advanced.proxy) ? '' : this.advanced.proxy;
    if (_.has(this.sessionCaps, `${this.vendorOptionsCapPrefix}:options`)) {
      this.addSessionCaps({
        source: 'appiumdesktop',
        isRealMobile: true,
      });
      if (this.advanced.useProxy) {
        this.addSessionCaps({proxyUrl});
      }
    } else {
      this.sessionCaps['lambdatest:source'] = 'appiumdesktop';
      this.sessionCaps['lambdatest:isRealMobile'] = true;
      if (this.advanced.useProxy) {
        this.sessionCaps['lambdatest:proxyUrl'] = proxyUrl;
      }
    }
  }
}
