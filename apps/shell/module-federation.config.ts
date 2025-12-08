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
    if (libraryName === 'react-router-dom') {
      return {
        ...defaultConfig,
        singleton: true,
        strictVersion: true,
      };
    }

    return defaultConfig;
  },
  
  remotes: [
    ['notes', 'http://localhost:4201/remoteEntry.js'],
    ['workspace', 'http://localhost:4202/remoteEntry.js'],
    ['tasks', 'http://localhost:4203/remoteEntry.js'],
    ['calendar', 'http://localhost:4204/remoteEntry.js'], 
  ],
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
