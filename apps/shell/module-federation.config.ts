import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  shared: (libraryName, defaultConfig) => {
    if (['react', 'react-dom'].includes(libraryName)) {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
      };
    }

    if (['zustand'].includes(libraryName)) {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: false,
      };
    }

    return defaultConfig;
  },
  remotes: ['notes', 'workspace', 'tasks', 'calendar'],
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
