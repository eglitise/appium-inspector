import moment from 'moment';

import {BaseVendor} from './base.js';

export class SaucelabsVendor extends BaseVendor {
  constructor(server, sessionCaps) {
    super(server, sessionCaps);
    this.vendor = server.sauce;
    this.vendorName = 'SauceLabs';
    this.vendorOptionsCap = 'sauce:options';
  }

  /**
   * @override
   */
  async setProperties() {
    const host = this.vendor.useSCProxy
      ? this.vendor.scHost || 'localhost'
      : `ondemand.${this.vendor.dataCenter}.saucelabs.com`;
    const port = this.vendor.useSCProxy ? parseInt(this.vendor.scPort, 10) || 4445 : 80;
    this.setCommonProperties({
      host,
      path: '/wd/hub',
      https: false,
      port,
    });

    this.setAccessProperties({
      username: {
        value: this.vendor.username || process.env.SAUCE_USERNAME,
        validateAs: 'Username',
      },
      accessKey: {
        value: this.vendor.accessKey || process.env.SAUCE_ACCESS_KEY,
        validateAs: 'Access Key',
      },
    });

    if (!this.sessionCaps[this.vendorOptionsCap].name) {
      const dateTime = moment().format('lll');
      this.addSessionCaps({
        name: `Appium Desktop Session -- ${dateTime}`,
      });
    }
  }
}
