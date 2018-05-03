/**
 * This module defines constants for this dashboard. Nothin' much else to say really.
 */

/**
 * The names for each log level, used in RosoutLog and RosoutTable. Each name
 * should hopefully be pretty self-explanatory.
 */
enum LOG_LEVELS {
  Debug = 1, Info = 2, Warn = 4, Error = 8, Fatal = 16
};

export default {
  LOG_LEVELS_ARRAY: ['Debug', 'Info', 'Warn', 'Error', 'Fatal'],
  LOG_LEVELS: LOG_LEVELS
};

