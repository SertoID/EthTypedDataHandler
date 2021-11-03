import { TAgent, IMessageHandler } from '@veramo/core'
import { IDidEthTypedData } from '../../src/types/IDidEthTypedData'

type ConfiguredAgent = TAgent<IDidEthTypedData & IMessageHandler>


export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('EthTypedDataHandler', () => {
    let agent: ConfiguredAgent

    beforeAll(async () => {
      testContext.setup()
      agent = testContext.getAgent()
      // const dids = await agent.didManagerGet();
      // console.log(dids)
      //const signedTypedData = 
    })
    afterAll(testContext.tearDown)

    it('should foo', async () => {
      // const result = await agent.myPluginFoo({
      //   did: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
      //   foo: 'lorem',
      //   bar: 'ipsum',
      // })
      expect(2+2).toEqual(4)
    })
  })
}
