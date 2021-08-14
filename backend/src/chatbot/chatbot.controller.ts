import axios from 'axios';
import { Client, findUser, updateUser } from '../repositories/fila-repo';
import { entrarNaFila, getPrevisaoUser } from '../controllers/fila-control';
import { getPropaganda } from '../controllers/propaganda-control';

interface fromUpdate {
  id: number,
  is_bot: boolean,
  first_name: string,
  last_name: string,
  username: string,
  language_code: string
}
interface messageUpdate {
  message_id: number,
  from: fromUpdate,
  chat: {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    type: string
  },
  date: number,
  text: string
}
export interface BotUpdate {
  update_id: number,
  message: messageUpdate,
  callback_query?: {
    id: string,
    from: fromUpdate,
    message: messageUpdate,
    chat_instance: string,
    data: string
  }
}
/*
export interface Chatbot {
  token_id: string,
  offset: number
}

const getUpdates = async (chatbot: Chatbot) => {
  const requestUrl = `https://api.telegram.org/bot${chatbot.token_id}/getUpdates?offset=${chatbot.offset + 1}`;
  const resultado = await axios.get(requestUrl);

  if (!resultado.data.ok) {
    console.log("Can't get updates from bot!")
    return chatbot;
  }

  const updates: BotUpdate[] = resultado.data.result;
  if (updates.length)
    console.log("New messages: ", updates.length);
  for (let update of updates) {
    chatbot.offset = update.update_id;
    await queryResult(chatbot, update);
  }

  return chatbot;
}

const filterTextToQuery = (text: string) => {
  //return text.replace(/[-ÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃẼĨÕŨáéíóúàèìòùâêîôûãõçÇ[/\]{}()*+=!\\^$|#]/g, '\\$&');
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const sendAdvertisementTo = async (chatbot: Chatbot, chat_id: number) => {
  var api = new telegram({
    token: chatbot.token_id
  })

  const propaganda = getPropaganda(undefined, undefined, undefined);

  api.sendPhoto({
    chat_id: chat_id,
    caption: propaganda?.text,
    photo: propaganda?.imagem
  })
}

export const sendMessageTo = async (chatbot: Chatbot, chat_id: number, text: string) => {
  const requestUrl = `https://api.telegram.org/bot${chatbot.token_id}/sendMessage?chat_id=${chat_id}&text=${filterTextToQuery(text)}`;
  return axios.get(requestUrl);
}

const joinQueue = async (name: string, chat_id: number, username: string, chatbot: Chatbot,) => {
  const user: Client = {
    nome: name,
    idade: 0,
    sexo: 'O',
    telegram_id: chat_id,
    entrou_na_fila_em: new Date(),
    saiu_da_fila_em: null,
  }
  if (username) user.username = username;
  const result: any = entrarNaFila(user);
  let msg = `Voce entrou na fila. Sua posicao atual é: ${result.posicao} e a previsao de espera e de ${result.previsao} minutos.`;

  if (result.error) {
    if (result.error == 'user_already_in_queue')
      msg = "Voce ja esta na fila. Para saber mais, mande 'status'.";
    else if (result.error == 'user_not_found')
      msg = "Erro ao entrar na fila. Por favor, tente novamente.";
  }

  const sendMessageResult = await sendMessageTo(chatbot, chat_id, msg);
}

export const requestStatus = async (chat_id: number, chatbot: Chatbot) => {
  const result: any = getPrevisaoUser(chat_id);
  let msg = `Sua posicao atual e: ${result.posicao} e a previsao de espera e de ${result.previsao} minutos.`;
  if (result.error) {
    if (result.error == 'user_not_found')
      msg = 'Voce nao esta em nenhuma fila. Envie "start" para entrar.';
  }
  const sendMessageResult = await sendMessageTo(chatbot, chat_id, msg);
}

const queryResult = async (chatbot: Chatbot, query: BotUpdate) => {
  const text = query.message.text;
  const name = query.message.chat.first_name + (query.message.chat.last_name ? ' ' + query.message.chat.last_name : '');
  const chat_id = query.message.chat.id;
  const username = query.message.from.username;

  if (!text) return;

  if (text.includes('start')) {
    await sendMessageTo(chatbot, chat_id, "Ola, sou o agente conversacional do Filad.ai e estou aqui para te ajudar! :)\nComandos:\n 'entrar' para entrar na fila.\n'status' para ver sua posicao na fila.\n'quero sair' para desistir de sua espera.");
  } else if (text.includes('entrar')) {
    await joinQueue(name, chat_id, username, chatbot);
  } else if (text.includes('status')) {
    await requestStatus(chat_id, chatbot);
  } else if (text.includes('quero sair')) {
    await axios.post('http://localhost:3333/api/fila/sair', { telegram_id: chat_id, desistencia: true });
  } else if (text.includes('easter-egg')) {
    sendAdvertisementTo(chatbot, chat_id);
  }
}*/

export class ChatBot {
  botapi: any;

  constructor(token: any) {
    const TG = require('telegram-bot-api');
    this.botapi = new TG({ token: token });
    this.botapi.setMessageProvider(new TG.GetUpdateMessageProvider())
    this.botapi.start().then(() => {
      console.log('Telegram API is running')
    });
    this.botapi.on('update', this.dealWithUpdate);
  }

  dealWithUpdate = (update: BotUpdate) => {
    var message: messageUpdate = update.callback_query ? update.callback_query!.message : update.message;
    const { chat_id, text, name, username } = this.fetchStuffFromMessageUpdate(message);

    console.log({ update })
    console.log({ chat_id, text, name, username });
    const user: Client | undefined = findUser(chat_id);

    if (text.includes('start') || text.includes('entrar')) {
      const result = this.joinQueue(name, chat_id, username);
      if (result == 'ok') {
        this.sendMessageAskSexo(chat_id);
      }
    } else if (user && user.contexto == 'ask_sexo') {
      if (['masculino', 'feminino', 'prefiro não informar'].some(t => t == text)) {
        const idx = ['masculino', 'feminino', 'prefiro não informar'].findIndex(t => t == text);
        const sexo = (idx == 0 ? 'M' : (idx == 1 ? 'F' : 'O'));
        updateUser(chat_id, { sexo, contexto: 'ask_idade' });
        this.sendMessageText(chat_id, 'Obrigado pela resposta.\n\nAgora só precisamos da sua idade, por favor, envie apenas os dígitos.');
      }
    } else if (user && user.contexto == 'ask_idade') {
      const rgx = /^[0-9]{1,2}$/g;
      if (text.match(rgx)) {
        const idade = Number(text);
        updateUser(chat_id, { idade, contexto: 'waiting' });
        this.sendMessageText(chat_id, 'Muito obrigado. Isto é tudo.\nPode ficar tranquilo que estarei aqui te atualizando sempre que houver mudanças na fila. :)');
      } else {
        this.sendMessageText(chat_id, 'Idade inválida.');
      }
    } else {
      this.sendMessageText(chat_id, 'Você não está em nenhuma fila. Por favor, entre em contato com o estabelecimento se você acha que isso é um erro.');
    }

  }

  fetchStuffFromMessageUpdate = (message: messageUpdate) => {
    const chat_id = message.chat.id;
    const text = message.text.toLowerCase();
    const name = message.chat.first_name + (message.chat.last_name ? ' ' + message.chat.last_name : '');
    const username = message.chat.username;
    return { chat_id, text, name, username };
  }

  joinQueue = (name: string, chat_id: number, username: string) => {
    const user: Client = {
      nome: name,
      idade: 0,
      sexo: 'O',
      telegram_id: chat_id,
      entrou_na_fila_em: new Date(),
      saiu_da_fila_em: null,
    }
    if (username) user.username = username;
    const result: any = entrarNaFila(user);
    let msg = `Você entrou na fila. Sua posição atual é: ${result.posicao} e a previsão de espera é de ${result.previsao} minutos.`;
    let ret = {};

    if (result.error) {
      ret = 'error';
      if (result.error == 'user_already_in_queue')
        msg = 'Você já está na fila. Para saber mais, mande "status".';
      else if (result.error == 'user_not_found')
        msg = 'Erro ao entrar na fila. Por favor, tente novamente.';
    } else {
      updateUser(chat_id, { contexto: 'ask_sexo' });
      ret = 'ok';
    }
    //Enviar propaganda em após 5 minutos
    //setTimeout(() => { sendAdvertisementTo(getChatbot(), user.telegram_id) }, 5 * 60 * 1000);

    this.sendMessageText(chat_id, msg);
    return ret;
  }

  sendMessageText = (chat_id: number, text: string) => {
    this.botapi.sendMessage({
      chat_id: chat_id,
      text: text,
      parse_mode: 'Markdown'
    })
  }

  sendMessageAskSexo = (chat_id: number) => {
    this.botapi.sendMessage({
      chat_id: chat_id,
      text: 'Por favor, para melhorar sua experiência de espera na fila, nos indique o seu sexo.',
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Masculino',
              callback_data: 'postback_sexo_masculino'
            },
            {
              text: 'Feminino',
              callback_data: 'postback_sexo_feminino'
            },
            {
              text: 'Prefiro não informar.',
              callback_data: 'postback_sexo_outro'
            }
          ]
        ],
        "resize_keyboard": true,
        "one_time_keyboard": true
      }
    })
  }
}