import {BaseVendor} from './base.js';

export class LocalVendor extends BaseVendor {
  constructor(server, sessionCaps) {
    super(server, sessionCaps);
    this.vendor = server.local;
  }

  /**
   * @override
   */
  async setProperties() {
    this.setCommonProperties({
      // if we're on windows, we won't be able to connect directly to '0.0.0.0'
      // so just connect to localhost; if we're listening on all interfaces,
      // that will of course include 127.0.0.1 on all platforms
      host: this.vendor.host === '0.0.0.0' ? 'localhost' : this.vendor.hostname,
      port: this.vendor.port,
    });
  }
}
