import { IAgentPlugin } from '@veramo/core'
import { IVerifyEthTypedDataVcArgs, IVerifyEthTypedDataVcResult, IDidEthTypedData, IEthTypedDataVc } from './types/IDidEthTypedData'
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
      if(!TypedData.proof || !TypedData.proof.proofValue) throw new Error("Proof is undefined")
      if(
        !TypedData.proof.eip712Domain || 
        !TypedData.proof.eip712Domain.messageSchema ||
        !TypedData.proof.eip712Domain.domain 
      ) throw new Error("eip712Domain is undefined")
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
      const didParts = signingInput.issuer.split(":")
      const didAddress = didParts[didParts.length-1]
      const issuerAddress = normalize(didAddress);
      if(recovered === issuerAddress){
        result.from = signingInput.issuer;
        result.to = signingInput.credentialSubject.id;
        result.createdAt = signingInput.issuanceDate;
        result.verified = true;
      } else {
        throw new Error("Recovered Address does not match issuer")
      }  
    } catch (e: any) {
      throw new Error(e);
    }

    return result;
  }
}
