import { getLocaleFromNavigator, init, register, addMessages } from "svelte-i18n";

const locales = ["en", "ko"];

for (let i = 0; i < locales.length; i++) {
  const locale = locales[i];
  register(locale, () => import(`../../locale/${locale}.json`));
}

init({
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator(),
});
