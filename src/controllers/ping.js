export default async function (bot, event) {
  if (event.type === 'message' && event.message.type === 'text' && event.message.text === '/ping') {
    return bot.replyMessage(event.replyToken, {
      type: 'text',
      text: '/pong'
    })
  }
  return null
}