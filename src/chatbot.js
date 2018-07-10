import * as line from '@line/bot-sdk'
import dotenv from 'dotenv'
import menu from './controllers/menu'
import ping from './controllers/ping'
import current from './controllers/current'
import forecast from './controllers/forecast'


dotenv.config()
const controllers = [menu, ping, current, forecast]
const client  = new line.Client({ channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN })

export default {
  client: client,
  middleware: line.middleware({ channelSecret: process.env.CHANNEL_SECRET }),
  webhook: (req, res) => {
    req.body.events.map(event => {
      console.log(event)
      controllers.forEach(async e => {
        try {
          if (await e(client, event) !== null) return
        } catch (err) {
          console.log(`[ERROR] ${err}`)
        }
      })
    })
    return res.send('OK')
  }
}