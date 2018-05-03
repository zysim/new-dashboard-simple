/**
 * The interface for a compass.
 * @prop {string} name    The compass name
 * @prop {number} bearing The compass bearing
 */
interface Compass {
  name: string,
  bearing: number
}

/**
 * A ROS topic interface.
 * @prop {number}        id    Topic ID
 * @prop {string}        name  Topic title
 * @prop {string|number} value Topic message
 */
interface Topic {
  id: number,
  name: string,
  value: string | number
};

/**
 * A ROS log message interface. This is for the messages received under the
 * '/rosout' topic name.
 * @prop {number} level The log level; one of {debug|info|warn|error|fatal}
 * @prop {string} msg   The log message
 */
interface LogMessage {
  readonly level: number;
  readonly msg: string;
};

/**
 * A ROS message interface. This is for the messages received for the ROS
 * Topic table at the top left.
 * @prop {number?}       latitude  (Optional) The boat's current latitude
 * @prop {number?}       longitude (Optional) The boat's current longitude
 * @prop {string}        topic     The topic's title
 * @prop {number|string} value     The topic's value, or message
 */
interface RosTopicMessage {
  latitude?: number,
  longitude?: number,
  topic: string,
  value: number | string
};

export {Compass, Topic, LogMessage, RosTopicMessage};
