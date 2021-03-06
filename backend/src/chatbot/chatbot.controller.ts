import axios from 'axios';
import { Client, findUser, updateUser } from '../repositories/fila-repo';
import { entrarNaFila, getPrevisaoUser } from '../controllers/fila-control';
import { updateRecentClientNps } from '../repositories/atendimentos-repo';
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
  text: string,
  contact?: {
    phone_number: string,
    first_name: string,
    user_id: number
  }
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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export class ChatBot {
  botapi: any;
  offset: number;

  constructor(token: any) {
    const TG = require('telegram-bot-api');
    this.botapi = new TG({ token: token });
    this.offset = 0;
    /*
    this.botapi.setMessageProvider(new TG.GetUpdateMessageProvider())
    this.botapi.start().then(() => {
      console.log('Telegram API is running')
    });
    this.botapi.on('update', this.dealWithUpdate);
    */

    setTimeout(async () => {
      while (true) {
        try {
          await this.getUpdates();
        } catch (e) { }
        await sleep(500);
      }
    }, 1500);
  }

  getUpdates = async () => {
    const URL = `https://api.telegram.org/bot${process.env.CHATBOT_TOKEN}/getUpdates?offset=${this.offset}`;
    await axios.get(URL).then((res) => {
      const data = res.data;
      if (data.result && data.result.length > 0) {
        for (let update of data.result) {
          this.offset = update.update_id + 1;
          this.dealWithUpdate(update);
        }
      }
    })
  }

  dealWithUpdate = (update: BotUpdate) => {
    var message: messageUpdate = update.callback_query ? update.callback_query!.message : update.message;
    const { chat_id, text, name, username, contact } = this.fetchStuffFromMessageUpdate(message);
    let callback_data = update.callback_query ? update.callback_query.data : '';
    const user: Client | undefined = findUser(chat_id);
    console.log({ chat_id, text, name, username, callback_data, context: user?.contexto, contact });

    if (text.includes('start') || text.includes('entrar')) {
      const result = this.joinQueue(name, chat_id, username);
      if (result == 'ok') {
        this.sendMessageAskSexo(chat_id);
      }
    } else if (user && user.contexto == 'ask_sexo') {
      if (['masculino', 'feminino', 'prefiro n??o informar.'].some(t => t == text)) {
        const idx = ['masculino', 'feminino', 'prefiro n??o informar.'].findIndex(t => t == text);
        const sexo = (idx == 0 ? 'M' : (idx == 1 ? 'F' : 'O'));
        updateUser(chat_id, { sexo, contexto: 'ask_idade' });
        this.sendMessageText(chat_id, 'Obrigado pela resposta.\n\nAgora s?? precisamos da sua idade, por favor, envie apenas os d??gitos.');
      }
    } else if (user && user.contexto == 'ask_idade') {
      const rgx = /^[0-9]{1,2}$/g;
      if (text.match(rgx)) {
        const idade = Number(text);
        updateUser(chat_id, { idade, contexto: 'ask_phone' });
        this.sendPhoneRequest(chat_id);
      } else {
        this.sendMessageText(chat_id, 'Idade inv??lida.');
      }
    } else if (user && user.contexto == 'ask_phone') {
      if (contact) {
        this.sendMessageText(chat_id, 'Muito obrigado. Isto ?? tudo.\nPode ficar tranquilo que estarei aqui te atualizando sempre que houver mudan??as na fila. :)');
        updateUser(chat_id, { contexto: 'waiting', phone_number: contact.phone_number });
      } else {
        this.sendPhoneRequest(chat_id, 'Por favor, envie-nos seu contato.');
      }
    } else if (user && (text.includes('status') || text.includes('tempo'))) {
      this.requestStatus(chat_id);
    } else if (!user && callback_data.includes('postback_nps')) {
      const isBadFeedback = callback_data.includes("ruim");

      let voto = "Bom";
      if (isBadFeedback) voto = "Ruim";
      else if (callback_data.includes("ok")) voto = "Ok"

      updateRecentClientNps(chat_id, isBadFeedback ? 0 : 1, voto);
      this.sendMessageText(chat_id, 'Obrigado pelo feedback!');
    } else if (!user) {
      this.sendMessageText(chat_id, 'Voc?? n??o est?? em nenhuma fila. Por favor, entre em contato com o estabelecimento se voc?? acha que isso ?? um erro.');
    } else {
      this.sendMessageText(chat_id, 'N??o entendi.');
    }

  }

  fetchStuffFromMessageUpdate = (message: messageUpdate) => {
    const chat_id = message.chat.id;
    const text = message.text?.toLowerCase() || '';
    const name = message.chat.first_name + (message.chat.last_name ? ' ' + message.chat.last_name : '');
    const username = message.chat.username;
    const contact = message.contact;
    return { chat_id, text, name, username, contact };
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
    let msg = `Voc?? entrou na fila. Sua posi????o atual ??: ${result.posicao} e a previs??o de espera ?? de ${result.previsao} minutos.`;
    let ret = {};

    if (result.error) {
      ret = 'error';
      if (result.error == 'user_already_in_queue')
        msg = 'Voc?? j?? est?? na fila. Para saber mais, mande "status".';
      else if (result.error == 'user_not_found')
        msg = 'Erro ao entrar na fila. Por favor, tente novamente.';
    } else {
      updateUser(chat_id, { contexto: 'ask_sexo' });
      ret = 'ok';
    }

    setTimeout(() => {
      const recentUser = findUser(user.telegram_id);
      console.log("Msg to " + recentUser?.nome)
      if (recentUser && recentUser.contexto == 'waiting')
        this.sendAdvertisementTo(recentUser);
      else console.log("Ad not send")
    }, 1 * 60 * 1000);

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
      text: 'Por favor, para melhorar sua experi??ncia de espera na fila, nos indique o seu sexo.',
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Masculino'
            },
            {
              text: 'Feminino'
            },
            {
              text: 'Prefiro n??o informar.'
            }
          ]
        ],
        "resize_keyboard": true,
        "one_time_keyboard": true
      }
    })
  }

  requestStatus = (chat_id: number) => {
    const result: any = getPrevisaoUser(chat_id);
    let msg = `Sua posi????o atual ??: ${result.posicao} e a previs??o de espera ?? de ${result.previsao} minutos.`;
    if (result.error) {
      if (result.error == 'user_not_found')
        msg = 'Voc?? n??o est?? em nenhuma fila. Envie "start" para entrar.';
    }
    this.sendMessageText(chat_id, msg);
  }

  requestNps = (chat_id: number, text: string) => {
    this.botapi.sendMessage({
      chat_id: chat_id,
      text: text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Ruim',
              callback_data: `postback_nps_ruim`
            },
            {
              text: 'Ok',
              callback_data: `postback_nps_ok`
            },
            {
              text: 'Bom',
              callback_data: `postback_nps_bom`
            }
          ]
        ],
        "resize_keyboard": true,
        "one_time_keyboard": true
      }
    })
  }

  sendPhoneRequest = (chat_id: number, text?: string) => {
    this.botapi.sendMessage({
      chat_id: chat_id,
      text: text || 'Para melhor atend??-lo, precisamos de seu n??mero de contato. Para continuar, ?? preciso aceitar.',
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Aceitar',
              callback_data: 'trigger',
              request_contact: true
            }
          ]
        ],
        "resize_keyboard": true,
        "one_time_keyboard": true
      }
    })
  }

  sendAdvertisementTo = (client: Client) => {
    const propaganda = getPropaganda(undefined, client.idade, client.sexo);
    this.botapi.sendPhoto({
      chat_id: client.telegram_id,
      caption: propaganda?.text,
      photo: propaganda?.imagem
    })
  }
}