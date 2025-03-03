import {BaseVendor} from './base.js';

export class MobitruVendor extends BaseVendor {
  constructor(server, sessionCaps) {
    super(server, sessionCaps);
    this.vendor = server.mobitru;
    this.vendorName = 'Mobitru';
    this.vendorOptionsCap = 'mobitru:options';
  }

  /**
   * @override
   */
  async setProperties() {
    const webDriverUrl =
      this.vendor.webDriverUrl ||
      process.env.MOBITRU_WEBDRIVER_URL ||
      'https://app.mobitru.com/wd/hub';
    const mobitruUrl = this.validateUrl(webDriverUrl);

    const https = mobitruUrl.protocol === 'https:';
    const port = mobitruUrl.port === '' ? (https ? 443 : 80) : mobitruUrl.port;
    this.setCommonProperties({
      host: mobitruUrl.hostname,
      path: mobitruUrl.pathname,
      https,
      port,
    });

    this.setAccessProperties({
      username: {
        value: this.vendor.username || process.env.MOBITRU_BILLING_UNIT || 'personal',
      },
      accessKey: {
        value: this.vendor.accessKey || process.env.MOBITRU_ACCESS_KEY,
        validateAs: 'Access Key',
      },
    });

    this.addSessionCaps({
      source: 'appium-inspector',
    });
  }
}
