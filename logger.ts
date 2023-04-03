import pinoLogger from 'pino';

const { NODE_ENV } = process.env;

const loggerOptions = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  },
  production: {},
  test: {}
};

const logger = pinoLogger({
  ...(loggerOptions[NODE_ENV] || {})
});

export default logger;
