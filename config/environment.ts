type Environment = 'production' | 'staging' | 'development' | 'local';

const ENV: Environment =
  (process.env.EXPO_PUBLIC_ENV as Environment) || 'production';

console.debug(`[DEBUG] Current ENV: ${ENV}`);
console.debug(`[DEBUG] EXPO_PUBLIC_ENV: ${process.env.EXPO_PUBLIC_ENV}`);

interface Config {
  environment: Environment;
  internalApiUrl: string;
  baseApiUrl: string;
  logtoEndpoint: string;
  logtoAppId: string;
  logtoRedirectUri: string;
}

const baseConfig: Record<Environment, Omit<Config, 'environment'>> = {
  production: {
    internalApiUrl: 'https://api.nessyl.com',
    baseApiUrl: 'https://api.nessyl.com',
    logtoEndpoint: process.env.EXPO_PUBLIC_AUTH_API_URL || '',
    logtoAppId: process.env.EXPO_PUBLIC_AUTH_APP_ID || '',
    logtoRedirectUri: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URI || '',
  },
  staging: {
    internalApiUrl: 'https://api.staging.nessyl.com',
    baseApiUrl: 'https://api.staging.nessyl.com',
    logtoEndpoint: process.env.EXPO_PUBLIC_AUTH_API_URL || '',
    logtoAppId: process.env.EXPO_PUBLIC_AUTH_APP_ID || '',
    logtoRedirectUri: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URI || '',
  },
  development: {
    internalApiUrl: 'https://api.dev.nessyl.com',
    baseApiUrl: 'https://api.dev.nessyl.com',
    logtoEndpoint: process.env.EXPO_PUBLIC_AUTH_API_URL || '',
    logtoAppId: process.env.EXPO_PUBLIC_AUTH_APP_ID || '',
    logtoRedirectUri: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URI || '',
  },
  local: {
    internalApiUrl: 'http://localhost:3333',
    baseApiUrl: 'http://localhost:3333',
    logtoEndpoint: process.env.EXPO_PUBLIC_AUTH_API_URL || '',
    logtoAppId: process.env.EXPO_PUBLIC_AUTH_APP_ID || '',
    logtoRedirectUri: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URI || '',
  },
};

const config: Config = {
  environment: ENV,
  ...baseConfig[ENV],
};

console.debug(`[DEBUG] Final config:`, JSON.stringify(config, null, 2));

export default config;
