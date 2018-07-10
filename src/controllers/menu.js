export default function (bot, event) {
  if (event.type === 'message' && event.message.type === 'text' && (event.message.text === '/menu' || event.message.text === '/start')) {
    return bot.replyMessage(event.replyToken, {
      type: 'template',
      altText: 'Open from your smartphone',
      template: {
        type: 'carousel',
        columns: [
          {
            title: 'Current Weather',
            text: 'View current weather based on your location',
            actions: [
              {
                type: 'message',
                label: 'Select',
                text: '/current'
              }
            ]
          },
          {
            title: 'Forecast',
            text: 'View weather forecast',
            actions: [
              {
                type: 'message',
                label: 'Select',
                text: '/forecast'
              }
            ]
          }
        ]
      }
    })
  }
  return null
}