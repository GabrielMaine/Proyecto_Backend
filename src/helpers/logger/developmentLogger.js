import winston from 'winston'
import { customLevelOptions } from './customLevelOptions.js'

export const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            ),
        }),
    ],
})
