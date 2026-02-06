import pino from "pino";

const isTest = process.env.NODE_ENV === "test";

const logger = isTest
  ? pino({ level: "silent" })
  : pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          singleLine: true,
        },
      },
    });

export default logger;
