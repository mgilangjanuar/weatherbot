import { outgoing } from '../utils/log'


export default async function (bot, event) {
  if (event.type === 'message' && event.message.type === 'text' && event.message.text === '/ping') {
    let reply = {
      type: 'text',
      text: '/pong'
    }
    return bot.replyMessage(event.replyToken, reply)
      .then(() => outgoing(event.source, reply))
  }
  return null
}
