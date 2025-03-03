import {BaseVendor} from './base.js';

export class KobitonVendor extends BaseVendor {
  constructor(server, sessionCaps) {
    super(server, sessionCaps);
    this.vendor = server.kobiton;
    this.vendorName = 'Kobiton';
    this.vendorOptionsCap = 'kobiton:options';
  }

  /**
   * @override
   */
  async setProperties() {
    this.setCommonProperties({
      host: process.env.KOBITON_HOST || 'api.kobiton.com',
      path: '/wd/hub',
      https: true,
      port: 443,
    });

    this.setAccessProperties({
      username: {
        value: this.vendor.username || process.env.KOBITON_USERNAME,
        validateAs: 'Username',
      },
      accessKey: {
        value: this.vendor.accessKey || process.env.KOBITON_ACCESS_KEY,
        validateAs: 'API Key',
      },
    });

    this.addSessionCaps({
      source: 'appiumdesktop',
    });
  }
}
