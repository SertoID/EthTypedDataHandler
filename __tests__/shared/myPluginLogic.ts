import { TAgent, IMessageHandler, VerifiableCredential } from '@veramo/core'
import { IDidEthTypedData } from '../../src/types/IDidEthTypedData'
import { signTypedData, signTypedData_v4 } from 'eth-sig-util'
import { createMessage, domain, types } from './TypedDataHelper'
type ConfiguredAgent = TAgent<IDidEthTypedData & IMessageHandler>


export default (testContext: {
  getAgent: () => ConfiguredAgent
  setup: () => Promise<boolean>
  tearDown: () => Promise<boolean>
}) => {
  describe('EthTypedDataHandler', () => {
    let agent: ConfiguredAgent
    let signedVc: string
    let issuerDid: string

    beforeAll(async () => {
      await testContext.setup()
      agent = testContext.getAgent()
      const did = await agent.didManagerGetByAlias({alias: 'test', provider: "did-ethr-rinkeby"});
      issuerDid = did.did
      signedVc = createVc(issuerDid)
    })
    afterAll(testContext.tearDown)

    const createVc = (issuer: string) => {
      const message = createMessage(issuer)
      const privateKey = Buffer.from('8173fa697c8ccaaa755f99a9797d3eec734cb42d6b22f2635441bf785c929f69', 'hex')
      const data = {
        types,
        primaryType: 'VerifiableCredential',
        domain,
        message
      }
      const signedTypedData = signTypedData_v4(privateKey, { data: data as any })
      const newObj = JSON.parse(JSON.stringify(message));
      newObj.proof.proofValue = signedTypedData
      newObj.proof.eip712Domain = {
        domain,
        messageSchema: types,
        primaryType: 'VerifiableCredential'
      }
      return JSON.stringify(newObj)
    }

    it('verifies valid vc', async () => {
      const result = await agent.verifyEthTypedDataVc({raw: signedVc})
      expect(result.verified).toEqual(true)
      expect(result.from).toEqual(issuerDid)
    })

    it('throws if issuer is invalid', async () => {
      const invalidVc = createVc("did:invalid:Issuer:Did")
      await expect(
        agent.verifyEthTypedDataVc({raw: invalidVc})
      ).rejects.toThrow('Recovered Address does not match issuer')
    })

    it('throws if proofvalue is undefined', async () => {
      const vc = createVc(issuerDid)
      const vcJson = JSON.parse(vc)
      delete vcJson.proof.proofValue
      const newVc = JSON.stringify(vcJson)
      await expect(
        agent.verifyEthTypedDataVc({raw: newVc})
      ).rejects.toThrow('Proof is undefined')
    })

    it('throws if types is undefined', async () => {
      const vc = createVc(issuerDid)
      const vcJson = JSON.parse(vc)
      console.log(vcJson)
      delete vcJson.proof.eip712Domain.messageSchema
      const newVc = JSON.stringify(vcJson)
      await expect(
        agent.verifyEthTypedDataVc({raw: newVc})
      ).rejects.toThrow('eip712Domain is undefined')
    })
  })
}
