import TelegramBot from "node-telegram-bot-api"
import {gameOptions, againOptions} from './options.js'

const token = '6326147541:AAFJ7CITuRhIr48h8SM1na4WEV4SLZV6Yao'

const bot = new TelegramBot(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId,'Отгадай число от 0 до 9')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId]=randomNumber
    await bot.sendMessage(chatId,"Отгадывай",gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command:'/start',description:'Приветствие'},
        {command:'/info',description:'Инфо'},
        {command:'/game', description: "Играть"}
    ])
    
    bot.on('message', async msg=>{
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
        await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/a/Ayunda_Risu_hololive/Ayunda_Risu_hololive_012.webp?v=1694285103')
        return bot.sendMessage(chatId, "Добро пожаловать")
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', async msg=>{
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data==='/again') {
            return startGame(chatId)
        }
        if (+data=== +chats[chatId]) {
            return await bot.sendMessage(chatId, "Ты угадал, было загадано "+ chats[chatId], againOptions)
        } else {
            return await bot.sendMessage(chatId, "Не угадал, было загадано "+ chats[chatId], againOptions)            
        }
    })
}

start()