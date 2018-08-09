import dotenv from 'dotenv'
import dashbot from 'dashbot'


dotenv.config()
const logger = dashbot(process.env.DASHBOT_KEY).generic

function getEventText(event) {
  if (event.type === 'message') {
    return event.message.type === 'text' ? event.message.text : `<${event.message.type}>`
  }
  return `<${event.type}>`
}

function getSourceId(source) {
  switch (source.type) {
    case 'group':
      return source.groupId
    case 'room':
      return source.roomId
    default:
      return source.userId
  }
}

export function incoming(events) {
  events.map(event => {
    logger.logIncoming({
      userId: getSourceId(event.source),
      text: getEventText(event),
      platformJson: event
    })
  })
}

export function outgoing(source, payload) {
  return logger.logOutgoing({
    userId: getSourceId(source),
    text: payload.type === 'text' ? payload.text : `<${payload.type}>`,
    platformJson: payload
  })
}
