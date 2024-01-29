import config from '../../config/config.js'
import { developmentLogger } from './developmentLogger.js'
import { productionLogger } from './productionLogger.js'

let logger

switch (config.enviroment) {
    case 'PRODUCTION': {
        logger = productionLogger
        break
    }

    case 'DEVELOPMENT': {
        logger = developmentLogger
        break
    }

    default: {
        throw new Error('Please provide a valid enviroment')
    }
}

export const generateLogger = (req, res, next) => {
    req.logger = logger
    if (config.enviroment === 'PRODUCTION') {
        req.logger.info('Logger setted for production enviroment')
    } else {
        req.logger.info('Logger setted for development enviroment')
    }
    next()
}
