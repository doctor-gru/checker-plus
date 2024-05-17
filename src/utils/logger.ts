import winston from 'winston';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple(),
  )
})