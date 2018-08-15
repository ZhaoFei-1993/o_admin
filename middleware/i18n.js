import cookieParser from "~/plugins/cookies"
import {getFormattedLang} from "../common/utilities";

export default async function ({
  store,
  query,
  error,
  req,
  replace,
  hotReload,
}) {
  if (hotReload) {
    return
  }
  let preferLanguage = "zh_Hans_CN"
  let cookies = {
    lang: "",
    timezone: "",
    addressformat: ""
  };

  let acceptLanguage = "";

  if (process.SERVER_BUILD) {
    acceptLanguage = req.headers["accept-language"];
    preferLanguage = store.state.locale.lang || acceptLanguage || "zh_Hans_CN";

    const content = req.headers.cookie || "";
    cookies = cookieParser.parse(content);
  } else {
    cookies = cookieParser.parse(document.cookie || "");
    acceptLanguage = store.state.locale.lang || navigator.language || navigator.browserLanguage;
  }

  const timezone = query.timezone || cookies.timezone || null;
  store.commit("timezone/setTimezone", timezone);

  const addressformat = query.addressformat || cookies.addressformat || null;
  store.commit("addressformat/setAddressFormat", addressformat);

  if (acceptLanguage) {
    preferLanguage = acceptLanguage;
  }

  const lang = query.lang || cookies.lang || preferLanguage;
  const formattedLang = getFormattedLang(lang);

  let priceunit = query.priceunit || cookies.priceunit || null;
  if (!priceunit || !priceunit.length) {
    priceunit = (formattedLang === 'zh_Hans_CN' ? 'CNY' : 'USD')
  }
  if (store.state.priceunit.options.indexOf(priceunit) < 0) {
    priceunit = 'USD';
  }
  store.commit("locale/setLang", formattedLang);
  store.commit("priceunit/setPriceunit", priceunit);
}
