import axios from 'axios';
import { Client } from '../repositories/fila-repo';
import { entrarNaFila, getPrevisaoUser } from '../controllers/fila-control';
import { getPropaganda } from '../controllers/propaganda-control';
var telegram = require('telegram-bot-api');

export interface BotUpdate {
  update_id: number,
  message: {
    message_id: number,
    from: {
      id: number,
      is_bot: boolean,
      first_name: string,
      last_name: string,
      username: string,
      language_code: string
    },
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
}

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
}

export { getUpdates };