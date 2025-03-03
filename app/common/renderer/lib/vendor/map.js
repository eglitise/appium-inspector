import {SERVER_TYPES} from '../../constants/session-builder';
import {HeadspinVendor} from './headspin.js';
import {KobitonVendor} from './kobiton.js';
import {LambdatestVendor} from './lambdatest.js';
import {LocalVendor} from './local.js';
import {MobitruVendor} from './mobitru.js';
import {SaucelabsVendor} from './saucelabs.js';

export const VENDOR_MAP = {
  [SERVER_TYPES.LOCAL]: LocalVendor,
  [SERVER_TYPES.SAUCE]: SaucelabsVendor,
  [SERVER_TYPES.HEADSPIN]: HeadspinVendor,
  [SERVER_TYPES.LAMBDATEST]: LambdatestVendor,
  [SERVER_TYPES.KOBITON]: KobitonVendor,
  [SERVER_TYPES.MOBITRU]: MobitruVendor,
};
