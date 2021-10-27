import { IAgentPlugin } from '@veramo/core'
import { IVerifyEthTypedDataVcArgs, IVerifyEthTypedDataVcResult, IDidEthTypedData, IRequiredContext } from './types/IDidEthTypedData'
import { schema } from './index'
import { recoverTypedSignature_v4, normalize } from "eth-sig-util";

/**
 * {@inheritDoc IDidEthTypedData}
 * @beta
 */
export class DidEthTypedData implements IAgentPlugin {
  readonly schema = schema.IDidEthTypedData

  // map the methods your plugin is declaring to their implementation
  readonly methods: IDidEthTypedData = {
    verifyEthTypedDataVc: this.verifyEthTypedDataVc.bind(this),
  }

  /** {@inheritdoc IDidEthTypedData.verifyEthTypedDataVc} */
  private async verifyEthTypedDataVc(args: IVerifyEthTypedDataVcArgs): Promise<IVerifyEthTypedDataVcResult> {
    let result: IVerifyEthTypedDataVcResult = { verified: false };
    try {
      const TypedData = JSON.parse(args.raw);
      const { proof, ...signingInput } = TypedData;
      const { proofValue, eip712Domain, ...verifyInputProof} = proof;
      const verificationMessage = {
        ...signingInput,
        proof: verifyInputProof
      }
  
      const objectToVerify = {
        message: verificationMessage,
        domain: eip712Domain.domain,
        types: eip712Domain.messageSchema,
        primaryType: eip712Domain.primaryType
      }
  
      const recovered = recoverTypedSignature_v4({data: objectToVerify, sig: proofValue});
      const issuerAddress = normalize(signingInput.issuer.split(":")[2]);
      if(recovered === issuerAddress){
        result.from = signingInput.issuer;
        result.to = signingInput.credentialSubject.id;
        result.createdAt = signingInput.issuanceDate;
        result.verified = true;
      } else {
        throw new Error("Recovered Address does not match issuer")
      }  
    } catch (e) {
      console.log(e)
    }

    return result;
  }
}
