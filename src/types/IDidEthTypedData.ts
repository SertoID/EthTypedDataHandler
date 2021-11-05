import { IPluginMethodMap, IAgentContext, IDIDManager, IResolver, IMessage, VerifiableCredential, W3CCredential } from '@veramo/core'

/**
 * Eth Typed Data plugin
 *
 * This plugin provides a method to verify VC's with the Eth Typed Data format
 * DID Comm plugin interface for {@link @veramo/core#Agent}
 * @beta
 */
export interface IDidEthTypedData extends IPluginMethodMap {
  /**
   * This method accepts a raw TypedData vc and verifies the issuer matches the recovered address
   *
   * @param args - Input parameters for this method
   *  args.raw - string - The string representation of a EthTypedData VC object
   * @param context - The required context where this method can run.
   *   Declaring a context type here lets other developers know which other plugins
   *   need to also be installed for this method to work.
   * @beta
   */
   verifyEthTypedDataVc(args: IVerifyEthTypedDataVcArgs): Promise<IVerifyEthTypedDataVcResult>
}

/**
 * The input to the {@link DidEthTypedData.verifyEthTypedDataVc} method.
 * Must be the raw string encoding of the VC
 * @beta
 */
export interface IVerifyEthTypedDataVcArgs {
  raw: string
}

/**
 * The boolean result of verifying an EthTypedData VC 
 *
 * @beta
 */
export interface IVerifyEthTypedDataVcResult extends W3CCredential {
  proof: Proof
}

/**
 * This context describes the requirements of this plugin.
 * For this plugin to function properly, the agent needs to also have other plugins installed that implement the
 * interfaces declared here.
 * You can also define requirements on a more granular level, for each plugin method or event handler of your plugin.
 * 
 * @beta
 */
export type IRequiredContext = IAgentContext<IResolver & IDIDManager>


/**
 * The expected object parsed from the raw VC
 * 
 * @beta
 */
export interface IEthTypedDataVc {
  type: string[],
  issuer: string,
  issuanceDate: string,
  credentialSubject: Extensible<{
    id?: string
  }>
  credentialSchema: any,
  proof: Proof
}

/**
 * Expected proof object from the raw vc
 * 
 * @beta
 */
export interface Proof {
  verificationMethod: string,
  created: string,
  proofPurpose: string,
  type: string,
  proofValue: string,
  eip712Domain: Eip712Domain
}

/**
 * Interface for the EIP712Domain property
 * 
 * @beta
 */
export interface Eip712Domain {
  domain: Domain,
  messageSchema: MessageTypes,
  primaryType: string
}

/**
 * Domain of the TypedData
 * @beta
 */
export interface Domain {
  chainId: number,
  name: string,
  version: string
}

/**
 * Types property describing the typed data
 * @beta
 */
export interface MessageTypes {
  EIP712Domain: TypedDataField[];
  [additionalProperties: string]: TypedDataField[];
}

/**
 * Type fields
 * @beta
 */
export interface TypedDataField {
  name: string;
  type: string;
};

type Extensible<T> = T & { [x: string]: any }