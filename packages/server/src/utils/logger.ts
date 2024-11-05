type InfoLogger = (log: String, args?: { [key: string]: any; }) => void
type WarnLogger = (log: String, args?: { [key: string]: any; }) => void
type ErrorLogger = (log: String, args: { error: string | Error, [key: string]: any; }) => void
type Logger = {
  info: InfoLogger,
  warn: WarnLogger,
  error: ErrorLogger
};

const logger: Logger = {
  info: (log, args) => {
    console.log(log, args || '')
  },
  warn: (log, args) => {
    console.warn(log, args || '')
  },
  error: (log, args) => {
    console.error(log, args || '')
  }
};

export default logger;