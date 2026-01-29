/**
 * Search Initialization
 *
 * Registers built-in search providers.
 * Import this file early in the app to ensure providers are registered.
 */

import { searchRegistry } from "./registry";
import { navigationSearchProvider } from "./providers";

// Register built-in providers
searchRegistry.register(navigationSearchProvider);

export { searchRegistry };
