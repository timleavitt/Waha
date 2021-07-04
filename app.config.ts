import { ExpoConfig, ConfigContext } from '@expo/config';

export default (context: ConfigContext) : ExpoConfig => {
  const bundledLanguages = process.env.BUNDLED_LANGUAGES ? process.env.BUNDLED_LANGUAGES.split(',') : undefined;
  return {
    ...context.config,
    "name": "Waha",
    "slug": "Waha",
    extra: {
      bundledLanguages
    }
  };
}