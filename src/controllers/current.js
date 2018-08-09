import axios from 'axios'
import redis from 'redis'
import bluebird from 'bluebird'
import moment from 'moment'
import { outgoing } from '../utils/log'


export default async function (bot, event) {
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)
  const redisClient = redis.createClient()

  if (event.type === 'message') {
    const userId = event.source.userId
    let reply
    if (event.message.type === 'text' && event.message.text === '/current') {
      redisClient.set(`/${userId}/state`, 'current')
      reply = {
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
      }
      return bot.replyMessage(event.replyToken, reply)
        .then(() => outgoing(event.source, reply))
    } else if (event.message.type === 'location') {
      try {
        var state = await redisClient.getAsync(`/${userId}/state`)
      } catch (err) { console.log(`[ERROR] ${err}`) }

      if (state === 'current') {
        redisClient.del(`/${userId}/state`)
        try {
          var weather = await axios.get(`${process.env.OPEN_WEATHER_URI}/weather`, {
            params: {
              appid: process.env.OPEN_WEATHER_KEY,
              units: 'metric',
              lat: event.message.latitude,
              lon: event.message.longitude
            }
          })
        } catch (err) { console.log(`[ERROR] ${err}`) }

        const data = weather.data
        reply = {
          type: 'flex',
          altText: 'Open from your smartphone',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'image',
                  url: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
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
                      text: `${data.main.temp}° C`,
                      size: '3xl'
                    },
                    {
                      type: 'text',
                      text: `${data.name}, ${data.sys.country}`
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
                    },
                    {
                      type: 'text',
                      text: 'Sunrise',
                      align: 'end',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: 'Sunset',
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
                      text: data.weather[0].main,
                      weight: 'bold',
                      align: 'start',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: `${data.main.pressure} hPa`,
                      weight: 'bold',
                      align: 'start',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: `${data.main.humidity}%`,
                      weight: 'bold',
                      align: 'start',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: moment(data.sys.sunrise * 1000).format('LT'),
                      weight: 'bold',
                      align: 'start',
                      margin: 'sm'
                    },
                    {
                      type: 'text',
                      text: moment(data.sys.sunset * 1000).format('LT'),
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
                { type: 'filler' },
                {
                  type: 'button',
                  action: {
                    type: 'message',
                    label: 'All Menu',
                    text: '/menu'
                  },
                  style: 'primary',
                  margin: 'lg'
                }
              ]
            }
          }
        }
        return bot.replyMessage(event.replyToken, reply)
          .then(() => outgoing(event.source, reply))
      }
    }
  }
  return null
}
