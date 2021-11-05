import { Message, AbstractMessageHandler } from '@veramo/message-handler'
import { IAgentContext, IResolver } from '@veramo/core'
import { IDidEthTypedData } from '.';
import { blake2bHex } from 'blakejs'

export type IContext = IAgentContext<IResolver & IDidEthTypedData>

export const MessageTypes = {
  typedData: 'EthTypedData'
}
/**
 * An implementation of the {@link @veramo/message-handler#AbstractMessageHandler}.
 *
 * This plugin can handle incoming EthTypedData Verifiable Credentials and prepare them
 * for internal storage as {@link @veramo/message-handler#Message} types.
 *
 * The current version can only handle stringified objects
 *
 * @remarks {@link @veramo/core#IDataStore | IDataStore }
 *
 * @public
 */
export class EthTypedDataHandler extends AbstractMessageHandler {
  async handle(message: Message, context: IContext): Promise<Message> {
    try {
      const { raw, metaData } = message;
      if(raw) {
        const result = await  context.agent.verifyEthTypedDataVc({ raw });
        if(result) {
          const vcObject = JSON.parse(raw);
          message.id = blake2bHex(raw);
          message.type = MessageTypes.typedData;
          message.from = result.issuer.id;
          message.to = result.credentialSubject.id;
          message.createdAt = result.issuanceDate;
          message.credentials = [result]
          return message;
        }
      } else {
        throw new Error("Message is undefined");
      }
      
    } catch (e) {}
    return super.handle(message, context)
  }
}