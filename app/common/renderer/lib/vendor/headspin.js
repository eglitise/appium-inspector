import {BaseVendor} from './base.js';

export class HeadspinVendor extends BaseVendor {
  constructor(server, sessionCaps) {
    super(server, sessionCaps);
    this.vendor = server.headspin;
  }

  /**
   * @override
   */
  setProperties() {
    const headspinUrl = this.validateUrl(this.vendor.webDriverUrl);
    const https = headspinUrl.protocol === 'https:';
    const port = headspinUrl.port === '' ? (https ? 443 : 80) : headspinUrl.port;
    this.setCommonProperties({
      host: headspinUrl.hostname,
      path: headspinUrl.pathname,
      https,
      port,
    });
  }
}
