import i18n from '../../i18next';

export class BaseVendor {
  /**
   * @param {unknown} server
   * @param {Record<string, any>} sessionCaps
   */
  constructor(server, sessionCaps) {
    this.advanced = server.advanced;
    this.sessionCaps = sessionCaps;
    this._t = i18n.t;
  }

  setCommonProperties({host, path, port, https}) {
    // It is fine to assign all parameters to 'this.vendor' values -
    // 'this.vendor' values are only saved in Redux and not sent to the actual server
    this.host = this.vendor.host = host;
    this.path = this.vendor.path = path;
    this.port = this.vendor.port = port;
    this.https = this.vendor.ssl = https;
  }

  setAccessProperties({username, accessKey, headers}) {
    const missingProps = [];

    function validateProperty(prop) {
      if (prop) {
        if (prop.validateAs && !prop.value) {
          missingProps.push(this._t(prop.validateAs));
        }
        return prop.value;
      }
    }

    this.username = validateProperty(username);
    this.accessKey = validateProperty(accessKey);
    this.headers = validateProperty(headers);

    if (missingProps.length > 0) {
      throw new Error(
        this._t('missingVendorParameters', {
          vendorName: this.vendorName,
          vendorParams: missingProps.join(', '),
        }),
      );
    }
  }

  validateUrl(url) {
    let webdriverUrl;
    try {
      webdriverUrl = new URL(url);
    } catch {
      throw new Error(`${this._t('Invalid URL:')} ${webdriverUrl}`);
    }
    return webdriverUrl;
  }

  addSessionCaps(caps) {
    this.sessionCaps[this.vendorOptionsCap] = {
      ...(this.sessionCaps[this.vendorOptionsCap] ?? {}),
      ...caps,
    };
  }

  /**
   * ! It is OK for this method to mutate this.sessionCaps
   */
  async setProperties() {
    throw new Error(
      `The setProperties() method must be implemented for the ${this.constructor.name}`,
    );
  }

  /**
   * @returns {Promise<VendorProperties>}
   */
  async apply() {
    await this.setProperties();
    return {
      host: this.host,
      path: this.path,
      port: this.port,
      https: this.https,
      username: this.username,
      accessKey: this.accessKey,
      headers: this.headers,
    };
  }
}

/**
 * @typedef {Object} VendorProperties
 * @property {string} [host='127.0.0.1'] Server host name
 * @property {number|string} [port=4723] Server port
 * @property {string} [username] Optional vendor-specific username
 * @property {string} [accessKey] Optional vendor-specific access key
 * @property {boolean} [https=false] Whether to use https protocol while conecting to the server
 * @property {string} [path='/'] Server pathname
 * @property {Record<string, string>} [headers] Optional server headers
 */
