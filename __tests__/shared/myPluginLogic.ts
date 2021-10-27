import { TAgent, IMessageHandler } from '@veramo/core'
import { IDidEthTypedDataHandler } from '../../src/types/IMyAgentPlugin'

type ConfiguredAgent = TAgent<IDidEthTypedDataHandler & IMessageHandler>

export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('EthTypedDataHandler', () => {
    let agent: ConfiguredAgent

    beforeAll(() => {
      testContext.setup()
      agent = testContext.getAgent()
    })
    afterAll(testContext.tearDown)

    it('should foo', async () => {
      const result = await agent.myPluginFoo({
        did: 'did:ethr:rinkeby:0xb09b66026ba5909a7cfe99b76875431d2b8d5190',
        foo: 'lorem',
        bar: 'ipsum',
      })
      expect(result).toEqual({ foobar: 'ipsum' })
    })
  })
}
