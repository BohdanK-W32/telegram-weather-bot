import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import env from 'env';

i18next.use(Backend).init(
  {
    fallbackLng: 'en',
    lng: 'en',
    load: 'languageOnly',
    debug: env.isDevelopment,
    supportedLngs: ['uk', 'en', 'ru'],
    ns: ['common', 'error', 'message', 'owner'],
    defaultNS: 'common',
    backend: {
      loadPath: path.resolve(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      crossDomain: false
    }
  },
  (err): void => {
    if (err) throw new Error(err);
    else console.info('I18n initialized successfully');
  }
);

export default i18next;
