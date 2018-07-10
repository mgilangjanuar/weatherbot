import axios from 'axios'
import redis from 'redis'
import bluebird from 'bluebird'
import moment from 'moment'


export default async function (bot, event) {
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)
  const redisClient = redis.createClient()

  if (event.type === 'message') {
    const userId = event.source.userId
    if (event.message.type === 'text' && event.message.text === '/forecast') {
      redisClient.set(`/${userId}/state`, 'forecast')
      return bot.replyMessage(event.replyToken, {
        type: 'template',
        altText: 'Open from your smartphone',
        template: {
          type: 'buttons',
          title: 'Send Location',
          text: 'Please send us your current location',
          actions: [
            {
              type: 'uri',
              label: 'Send',
              uri: 'line://nv/location'
            }
          ]
        }
      })
    } else if (event.message.type === 'location') {
      try {
        var state = await redisClient.getAsync(`/${userId}/state`)
      } catch (err) { console.log(`[ERROR] ${err}`) }

      if (state === 'forecast') {
        redisClient.del(`/${userId}/state`)
        try {
          var forecast = await axios.get(`${process.env.OPEN_WEATHER_URI}/forecast`, {
            params: {
              appid: process.env.OPEN_WEATHER_KEY,
              units: 'metric',
              lat: event.message.latitude,
              lon: event.message.longitude
            }
          })
        } catch (err) { console.log(`[ERROR] ${err}`) }

        const data = forecast.data
        return bot.replyMessage(event.replyToken, {
          type: 'flex',
          altText: 'Open from your smartphone',
          contents: {
            type: 'carousel',
            contents: data.list.slice(0, 10).map(e => {
              return {
                type: 'bubble',
                header: {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'image',
                      url: `https://openweathermap.org/img/w/${e.weather[0].icon}.png`,
                      flex: 1,
                      size: 'xs'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      flex: 2,
                      contents: [
                        {
                          type: 'text',
                          text: `${e.main.temp}° C`,
                          size: '3xl'
                        },
                        {
                          type: 'text',
                          text: `${data.city.name}, ${data.city.country}`
                        }
                      ]
                    }
                  ]
                },
                body: {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'box',
                      layout: 'vertical',
                      flex: 3,
                      contents: [
                        {
                          type: 'text',
                          text: 'Weather',
                          align: 'end',
                          margin: 'sm'
                        },
                        {
                          type: 'text',
                          text: 'Pressure',
                          align: 'end',
                          margin: 'sm'
                        },
                        {
                          type: 'text',
                          text: 'Humidity',
                          align: 'end',
                          margin: 'sm'
                        }
                      ]
                    },
                    { type: 'filler' },
                    {
                      type: 'box',
                      layout: 'vertical',
                      flex: 3,
                      contents: [
                        {
                          type: 'text',
                          text: e.weather[0].main,
                          weight: 'bold',
                          align: 'start',
                          margin: 'sm'
                        },
                        {
                          type: 'text',
                          text: `${e.main.pressure} hPa`,
                          weight: 'bold',
                          align: 'start',
                          margin: 'sm'
                        },
                        {
                          type: 'text',
                          text: `${e.main.humidity}%`,
                          weight: 'bold',
                          align: 'start',
                          margin: 'sm'
                        }
                      ]
                    }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'separator',
                      margin: 'xxl'
                    },
                    {
                      type: 'text',
                      text: moment(e.dt * 1000).format('lll'),
                      align: 'center',
                      size: 'lg',
                      margin: 'xl'
                    },
                    {
                      type: 'spacer',
                      size: 'md'
                    }
                  ]
                }
              }
            })
          }
        })
      }
    }
  }
}