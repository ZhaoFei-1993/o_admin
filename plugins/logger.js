const log4js = require('log4js');
const layouts = require('log4js/lib/layouts');
const os = require('os');
const serverName = os.hostname();
const isDev = process.env.MODE !== 'production';
const globalLevel = isDev ? 'TRACE' : 'INFO';

log4js.addLayout('filter', function (config) {
  // 去掉请求头里面的敏感用户信息
  return function (logEvent, timezoneOffset) {
    if (logEvent && logEvent.data && logEvent.data.length) {
      logEvent.data.forEach(err => {
        if (err.config && err.config.headers) {
          err.config.headers.Authorization = 'hidden by log4js';
          err.config.headers.cookie = 'hidden by log4js';
        }
      });
    }
    return layouts.basicLayout(logEvent, timezoneOffset);
  };
});

const smtpAppender = {
  type: '@log4js-node/smtp',
  recipients: 'dengshen@viabtc.com,linjunfeng@viabtc.com',
  sender: 'alert@viabtc.com',
  attachment: {
    enable: true,
    filename: 'common.log',
    message: '详情请查看日志文件',
  },
  transport: {
    plugin: 'smtp',
    options: {
      host: 'smtp.exmail.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'alert@viabtc.com',
        pass: '4s7%pCDg1hR!',
      },
    },
  },
  html: false,
  sendInterval: 3600,
};

const logConfig = {
  pm2: true,
  pm2InstanceVar: 'OTC_ADMIN',
  appenders: {
    commonFile: {
      type: 'file', // 文件日志，默认保留5个备份
      filename: 'logs/common.log',
      maxLogSize: 10485760, // 10Mb
    },
    common: { // 普通日志记录INFO和WARN级别
      type: 'logLevelFilter',
      level: 'INFO',
      maxLevel: 'WARN',
      appender: 'commonFile',
      layout: {type: 'filter'},
    },
    errorFile: {
      type: 'file',
      filename: 'logs/error.log',
    },
    error: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
      layout: {type: 'filter'},
    },
    debug: {
      type: 'console',
      layout: {type: 'filter'},
    },
  },
  categories: {
    default: {
      appenders: ['common', 'error'],
      level: globalLevel,
    },
  },
};

if (isDev) {
  // 非生产环境下，所有日志打印到console
  logConfig.categories = {
    default: {
      appenders: ['debug'],
      level: globalLevel,
    },
  };
}

if (!isDev) { // 生产环境才发送log，log4js会自动根据instanceVar来处理log文件（https://log4js-node.github.io/log4js-node/clustering.html）
  logConfig.appenders = {
    ...logConfig.appenders,
    errorEmailSender: {
      ...smtpAppender,
      subject: serverName + '[❌Error] OTC ADMIN最近1小时错误日志',
      attachment: {
        ...smtpAppender.attachment,
        filename: 'error.log',
      },
      sendInterval: 3600, // 错误日志一小时发送一次
    },
    errorEmail: { // 发送错误日志邮件
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorEmailSender',
    },
    commonEmailSender: {
      ...smtpAppender,
      subject: serverName + '[⚠️Common] OTC ADMIN最近4小时普通日志',
      attachment: {
        ...smtpAppender.attachment,
        filename: 'common.log',
      },
      sendInterval: 14400, // 普通日志4小时发送一次
    },
    commonEmail: { // 发送普通日志邮件
      type: 'logLevelFilter',
      level: 'INFO',
      appender: 'commonEmailSender',
    },
  };
  logConfig.categories.default.appenders.push('commonEmail', 'errorEmail');
}

log4js.configure(logConfig);
const logger = log4js.getLogger();

console.log = console.info = logger.info.bind(logger);
console.error = logger.error.bind(logger);
console.debug = logger.debug.bind(logger);
console.warn = logger.warn.bind(logger);
console.trace = logger.trace.bind(logger);
console.fatal = logger.fatal.bind(logger);

module.exports = logger;
