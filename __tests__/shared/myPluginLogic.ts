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
      expect(result.issuer.id).toEqual(issuerDid)
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
      delete vcJson.proof.eip712Domain.messageSchema
      const newVc = JSON.stringify(vcJson)
      await expect(
        agent.verifyEthTypedDataVc({raw: newVc})
      ).rejects.toThrow('eip712Domain is undefined')
    })

    it('proper verified URI encoded vc', async () => {
      const vc = "%7B%22%40context%22%3A%5B%22https%3A%2F%2Fwww.w3.org%2F2018%2Fcredentials%2Fv1%22%2C%22https%3A%2F%2Fbeta.api.schemas.serto.id%2Fv1%2Fpublic%2Fsocial-media-linkage-credential%2F1.0%2Fld-context.json%22%5D%2C%22type%22%3A%5B%22VerifiableCredential%22%2C%22SocialMediaProfileLinkage%22%5D%2C%22issuer%22%3A%22did%3Aethr%3A0xBf9059ddF9e1954E0956f41Bc757c411be602560%22%2C%22issuanceDate%22%3A%222021-11-08T06%3A11%3A40.100Z%22%2C%22credentialSubject%22%3A%7B%22socialMediaProfileUrl%22%3A%22https%3A%2F%2Ftwitter.com%2FSertoTest1%22%2C%22id%22%3A%22did%3Aethr%3A0xBf9059ddF9e1954E0956f41Bc757c411be602560%22%7D%2C%22credentialSchema%22%3A%7B%22id%22%3A%22https%3A%2F%2Fbeta.api.schemas.serto.id%2Fv1%2Fpublic%2Fsocial-media-linkage-credential%2F1.0%2Fjson-schema.json%22%2C%22type%22%3A%22JsonSchemaValidator2018%22%7D%2C%22proof%22%3A%7B%22verificationMethod%22%3A%22did%3Aethr%3A0xBf9059ddF9e1954E0956f41Bc757c411be602560%23controller%22%2C%22created%22%3A%222021-11-08T06%3A11%3A40.100Z%22%2C%22proofPurpose%22%3A%22assertionMethod%22%2C%22type%22%3A%22EthereumEip712Signature2021%22%2C%22proofValue%22%3A%220x5fdd638ea301303bfb3459d8eb39ed1def6fb5e592ee00fe2fedc80705a9884d41db33f532037a6cd5d6b88f4bdfd25d7ef7613331e11772aa8ba7cc649de1561b%22%2C%22eip712Domain%22%3A%7B%22domain%22%3A%7B%22chainId%22%3A1%2C%22name%22%3A%22SocialMediaProfileLinkage%22%2C%22version%22%3A%221%22%7D%2C%22messageSchema%22%3A%7B%22EIP712Domain%22%3A%5B%7B%22name%22%3A%22name%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22version%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22chainId%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22VerifiableCredential%22%3A%5B%7B%22name%22%3A%22%40context%22%2C%22type%22%3A%22string%5B%5D%22%7D%2C%7B%22name%22%3A%22type%22%2C%22type%22%3A%22string%5B%5D%22%7D%2C%7B%22name%22%3A%22issuer%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22issuanceDate%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22credentialSubject%22%2C%22type%22%3A%22CredentialSubject%22%7D%2C%7B%22name%22%3A%22credentialSchema%22%2C%22type%22%3A%22CredentialSchema%22%7D%2C%7B%22name%22%3A%22proof%22%2C%22type%22%3A%22Proof%22%7D%5D%2C%22CredentialSchema%22%3A%5B%7B%22name%22%3A%22id%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22type%22%2C%22type%22%3A%22string%22%7D%5D%2C%22CredentialSubject%22%3A%5B%7B%22name%22%3A%22socialMediaProfileUrl%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22id%22%2C%22type%22%3A%22string%22%7D%5D%2C%22Proof%22%3A%5B%7B%22name%22%3A%22verificationMethod%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22created%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22proofPurpose%22%2C%22type%22%3A%22string%22%7D%2C%7B%22name%22%3A%22type%22%2C%22type%22%3A%22string%22%7D%5D%7D%2C%22primaryType%22%3A%22VerifiableCredential%22%7D%7D%7D"
      const result = await agent.verifyEthTypedDataVc({raw: vc})
      expect(result).toBeDefined()
      
    })
  })
}
