import axios from 'axios';

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
  console.log({ updates });
  for (let update of updates) {
    chatbot.offset = update.update_id;
    await queryResult(chatbot, update);
  }

  return chatbot;
}

const sendMessageTo = async (chatbot: Chatbot, chat_id: number, text: string) => {
  const requestUrl = `https://api.telegram.org/bot${chatbot.token_id}/sendMessage?chat_id=${chat_id}&text=${text}`;
  console.log(requestUrl);
  return axios.get(requestUrl);
}

const queryResult = async (chatbot: Chatbot, query: BotUpdate) => {
  const text = query.message.text;
  const name = query.message.chat.first_name + query.message.chat.last_name;
  const chat_id = query.message.chat.id;
  if (text.includes('start') || text.includes('Entrar na fila')) {
    const result = await axios.post('http://localhost:3333/api/fila/entrar', {
      nome: name,
      idade: 0,
      sexo: 'O',
      telegram_id: chat_id,
      date: query.message.date
    });
    console.log("Entrar na fila result: ", result.data);
    let msg = 'Entrou na fila com sucesso.';
    if (result.data.error) {
      msg = "Esse usuario ja esta na fila.";
    }
    const sendMessageResult = await sendMessageTo(chatbot, chat_id, msg);
    console.log(sendMessageResult.data);
  }
}

export { getUpdates };