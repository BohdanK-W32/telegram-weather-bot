import { Telegraf, Markup, session, Context } from 'telegraf';
import i18n from 'i18n';
import UserModel from 'models/user';
import AdminModel from 'models/admin';
import LocationModel from 'models/location';
import { getFullNameWithUsername, filterTodayHourly, filterTomorrowHourly } from 'utils';
import { timeString, getHourlyWeatherString } from 'helpers/formatString';
import fetchWeather from 'config/fetchWeather';
import * as icons from 'config/icons.json';
import env from 'env';

const bot = new Telegraf(env.telegram.botToken);

const EN_LANG: string = 'en';
const UA_LANG: string = 'uk';
const RU_LANG: string = 'ru';
const langList = [EN_LANG, UA_LANG, RU_LANG];

type LangType = 'en' | 'uk' | 'ru';
type nextMiddleware = () => Promise<void>;
// eslint-disable-next-line
type replyLanguageChangedType = (lang: LangType, isNewUser?: boolean) => void;

const setUserLang = async (userId: number, lang: LangType, replyLangChanged: replyLanguageChangedType) => {
  try {
    let user = await UserModel.findOne({ user_id: userId });

    if (user) {
      replyLangChanged(lang, false);

      if (user.lang !== lang) {
        user.lang = lang;

        return await user.save();
      }

      return null;
    }

    replyLangChanged(lang, true);

    return await UserModel.create({ user_id: userId, lang });
  } catch (err) {
    console.error(new Error('setUserLang error: ' + err));
  }
};

const langSelect = async (ctx: Context & { match: RegExpExecArray }, next: nextMiddleware) => {
  const replyLangChanged = (lang: LangType, isNewUser?: boolean): void => {
    i18n.changeLanguage(lang);

    if (isNewUser) {
      ctx.reply(i18n.t('hello', { name: ctx.from?.first_name || 'User' }), locationMenu(i18n.t('sendLocation')));
    } else {
      ctx.reply(i18n.t('langChangedSuccessfully'), locationMenu(i18n.t('sendLocation')));
    }
  };

  const langCode: LangType =
    ctx.match[0] === UA_LANG
      ? UA_LANG
      : ctx.match[0] === RU_LANG
      ? RU_LANG
      : ctx.match[0] === EN_LANG
      ? EN_LANG
      : EN_LANG;

  try {
    if (ctx.chat) await setUserLang(ctx.chat.id, langCode, replyLangChanged);

    return next();
  } catch (err) {
    console.error(new Error(err));
  }
};

const langMenu = Markup.inlineKeyboard([
  [Markup.button.callback('🇺🇸', EN_LANG), Markup.button.callback('🇺🇦', UA_LANG), Markup.button.callback('🇷🇺', RU_LANG)]
]);

const locationMenu = (text: string) => Markup.keyboard([Markup.button.locationRequest(text)]).resize();

const changeLangMessage = {
  text: 'Choose your language / оберіть мову / выберите язык',
  menu: langMenu
};

/*
 * Bot start
 */

bot.use(session());

bot.start(async (ctx, next) => {
  try {
    await ctx.reply(i18n.t('common:hello', { name: 'Aaa' }), changeLangMessage.menu);

    return next();
  } catch (err) {
    console.error(new Error(err));
  }
});

bot.action(langList, langSelect);

bot.command('changeLang', async (ctx, next) => {
  try {
    await ctx.reply(changeLangMessage.text, changeLangMessage.menu);

    return next();
  } catch (err) {
    console.error(new Error(err));
  }
});

bot.command('sendAll', async ({ reply, message, telegram, from }) => {
  if (!from) {
    reply(i18n.t('error:unknown'));

    return console.error(new Error('context.from is undefined'));
  }

  const isAdmin = Boolean(await AdminModel.findOne({ user_id: from.id }));

  if (!from.is_bot && isAdmin) {
    const msg = message.text.slice(9, message.text.length);
    const isOwner = Boolean(from ? await AdminModel.findOne({ user_id: from.id, is_owner: true }) : false);
    const owner = await AdminModel.findOne({ is_owner: true });

    if (isOwner) {
      const allUsers = await UserModel.find({}, 'user_id');

      if (!allUsers[0].user_id) return reply(i18n.t('owner:getDatabaseFailed'));

      allUsers.map(({ user_id }: { user_id: number }) => telegram.sendMessage(user_id, msg));
      return reply(i18n.t('owner:sendSuccessfully'));
    }

    telegram.sendMessage(
      owner.user_id,
      i18n.t('owner_moderation', { name: getFullNameWithUsername(from), id: from.id }) + msg
    );
    return reply(i18n.t('moderation'));
  }

  return null;
});

// TODO Setup sending meessage to specific user
// FIXME Setup sending meessage to specific user
bot.command('send', async ({ reply, message, telegram, from }) => {
  if (!from) {
    reply(i18n.t('error:unknown'));

    return console.error(new Error('context.from is undefined'));
  }

  const isOwner = Boolean(await AdminModel.findOne({ user_id: from.id, is_owner: true }));

  if (!isOwner) return reply('Error 401. Unauthorized');

  if (isOwner) {
    const msg = message.text.trim().slice(6, message.text.length).split(' ');
    const targetUserId = msg[0];

    return telegram
      .sendMessage(targetUserId, msg.splice(1).join(' '))
      .then(() => reply(i18n.t('owner:sendSuccessfully')))
      .catch(({ response }) => reply(response.error_code + ' ' + response.description));
  }

  return null;
});

bot.command('coordinates', async ({ reply, replyWithHTML, from, message }) => {
  if (!from) {
    reply(i18n.t('error:unknown'));

    return console.error(new Error('context.from is undefined'));
  }

  const msg = message.text
    .trim()
    .slice(13, message.text.length)
    .split(/[;|,| ]/);

  if (msg.length !== 2) return reply(i18n.t('error:coordinatesSyntax'));

  const lat = parseFloat(msg[0].trim());
  const lng = parseFloat(msg[1].trim());

  await UserModel.findOne({ user_id: from.id }, null, null, (err, res) => {
    if (err) return console.error(err);
    if (res) i18n.changeLanguage(res.lang);
  });

  await LocationModel.create({ user_id: from.id, location: { lat, lng } });

  await fetchWeather({ lat, lng, lang: i18n.language })
    .then(res => {
      if (!res) return null;

      const currently = { ...res.currently, icon: res.currently.icon ? icons[res.currently.icon] : null };
      const today = {
        summary: res.daily.data[0].summary,
        sunriseTime: timeString({ time: res.daily.data[0].sunriseTime, timezone: res.timezone }),
        sunsetTime: timeString({ time: res.daily.data[0].sunsetTime, timezone: res.timezone }),
        icon: res.daily.data[0].icon ? icons[res.daily.data[0].icon] : '',
        data: getHourlyWeatherString({
          data: filterTodayHourly(res),
          timezone: res.timezone
        })
      };
      const tomorrow = {
        summary: res.daily.data[1].summary,
        sunriseTime: timeString({ time: res.daily.data[1].sunriseTime, timezone: res.timezone }),
        sunsetTime: timeString({ time: res.daily.data[1].sunsetTime, timezone: res.timezone }),
        icon: res.daily.data[1].icon ? icons[res.daily.data[1].icon] : '',
        data: getHourlyWeatherString({
          data: filterTomorrowHourly(res),
          timezone: res.timezone
        })
      };

      const weatherString = `${i18n.t('message:weather.currently', currently)}${
        today.data.length ? i18n.t('message:weather.today', today) : ''
      }${i18n.t('message:weather.tomorrow', tomorrow)}`;

      replyWithHTML(weatherString).catch(err => console.error(new Error(err)));
    })
    .catch(err => console.error(new Error(err)));
});

bot.on('location', async ({ reply, replyWithHTML, from, message }) => {
  if (!from) {
    reply(i18n.t('error:unknown'));

    return console.error(new Error('context.from is undefined'));
  }

  const { latitude: lat, longitude: lng } = message.location;

  await UserModel.findOne({ user_id: from.id }, null, null, (err, res) => {
    if (err) return console.error(err);
    if (res) i18n.changeLanguage(res.lang);
  });

  await LocationModel.create({ user_id: Number(from.id), location: { lat, lng } });

  await fetchWeather({ lat, lng, lang: i18n.language })
    .then(res => {
      if (!res) return null;

      const currently = { ...res.currently, icon: res.currently.icon ? icons[res.currently.icon] : '' };
      const today = {
        summary: res.daily.data[0].summary,
        sunriseTime: timeString({ time: res.daily.data[0].sunriseTime, timezone: res.timezone }),
        sunsetTime: timeString({ time: res.daily.data[0].sunsetTime, timezone: res.timezone }),
        icon: res.daily.data[0].icon ? icons[res.daily.data[0].icon] : '',
        data: getHourlyWeatherString({
          data: filterTodayHourly(res),
          timezone: res.timezone
        })
      };
      const tomorrow = {
        summary: res.daily.data[1].summary,
        sunriseTime: timeString({ time: res.daily.data[1].sunriseTime, timezone: res.timezone }),
        sunsetTime: timeString({ time: res.daily.data[1].sunsetTime, timezone: res.timezone }),
        icon: res.daily.data[1].icon ? icons[res.daily.data[1].icon] : '',
        data: getHourlyWeatherString({
          data: filterTomorrowHourly(res),
          timezone: res.timezone
        })
      };

      const weatherString = `${i18n.t('message:weather.currently', currently)}${
        today.data.length ? i18n.t('message:weather.today', today) : ''
      }${i18n.t('message:weather.tomorrow', tomorrow)}`;

      replyWithHTML(weatherString).catch(err => console.error(new Error(err)));
    })
    .catch(err => console.error(new Error(err)));
});

export default bot;
