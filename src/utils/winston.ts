import { transports, format, createLogger } from 'winston';
import 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

const messageFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log` daily
    // - Write all logs with level `info` and below to `combined.log` daily
    //
    new transports.DailyRotateFile({
      datePattern: 'DD-MM-YYY',
      filename: `error.%DATE%.log`,
      dirname: './src/log/',
      level: 'error',
      format: combine(label({ label: 'Error' }), timestamp(), messageFormat),
    }),
    new transports.DailyRotateFile({
      datePattern: 'DD-MM-YYY',
      filename: `combined.%DATE%.log`,
      dirname: './src/log/',
      level: 'debug',
      format: combine(label({ label: 'Combined' }), timestamp(), messageFormat),
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      datePattern: 'DD-MM-YYY',
      filename: `exceptions.%DATE%.log`,
      dirname: './src/log/',
      format: combine(
        label({ label: 'Exceptions' }),
        timestamp(),
        messageFormat
      ),
    }),
  ],
  exitOnError: false,
});

//
// If not in production, log to `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest })`
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        format.colorize(),
        label({ label: 'Dev' }),
        timestamp(),
        messageFormat
      ),
    })
  );
}

if (process.env.NODE_ENV === 'test') {
  logger.clear();
  logger.add(
    new transports.DailyRotateFile({
      datePattern: 'DD-MM-YYY',
      filename: `test.%DATE%.log`,
      dirname: './src/log/',
      level: 'debug',
      format: combine(label({ label: 'Test' }), timestamp(), messageFormat),
    })
  );
}

export default logger;
