import axios from 'axios';
import { Client } from '../repositories/fila-repo';
import { entrarNaFila, getPrevisaoUser } from '../controllers/fila-control';

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

const sendMessageTo = async (chatbot: Chatbot, chat_id: number, text: string) => {
  const requestUrl = `https://api.telegram.org/bot${chatbot.token_id}/sendMessage?chat_id=${chat_id}&text=${text}`;
  return axios.get(requestUrl);
}

const queryResult = async (chatbot: Chatbot, query: BotUpdate) => {
  const text = query.message.text;
  const name = query.message.chat.first_name + ' ' + query.message.chat.last_name;
  const chat_id = query.message.chat.id;
  if (text.includes('start') || text.includes('Entrar na fila')) {
    const user: Client = {
      nome: name,
      idade: 0,
      sexo: 'O',
      telegram_id: chat_id,
      entrou_na_fila_em: new Date(),
      saiu_da_fila_em: null,
    }
    if (query.message.from.username) user.username = query.message.from.username;
    const result: any = entrarNaFila(user);
    let msg = `Voce entrou na fila. Sua posicao atual e: ${result.posicao} e a previsao de espera e de ${result.previsao} minutos.`;

    if (result.error) {
      if (result.error == 'user_already_in_queue')
        msg = "Esse usuario ja esta na fila.";
      else if (result.error == 'user_not_found')
        msg = "Erro ao entrar na fila. Por favor, tente novamente.";
    }

    const sendMessageResult = await sendMessageTo(chatbot, chat_id, msg);
  } else if (text.includes('status')) {
    const result: any = getPrevisaoUser(chat_id);
    let msg = `Sua posicao atual e: ${result.posicao} e a previsao de espera e de ${result.previsao} minutos.`;
    if (result.error) {
      if (result.error == 'user_not_found')
        msg = 'Voce nao esta em nenhuma fila. Envie "start" para entrar.';
    }
    const sendMessageResult = await sendMessageTo(chatbot, chat_id, msg);
  }
}

export { getUpdates };