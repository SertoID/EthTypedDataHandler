
export const createDid = async(agent: any) => {
  try {
    const key = {
      privateKeyHex: '8173fa697c8ccaaa755f99a9797d3eec734cb42d6b22f2635441bf785c929f69',
      type: 'Secp256k1',
      kms: 'local',
      meta: {
        algorithms: ['ES256K', 'ES256K-R', 'eth_signTransaction', 'eth_signTypedData', 'eth_signMessage'],
      }
    }
  
    const identifier = {
      alias: 'test',
      provider: 'did-ethr-rinkeby',
      did: 'did:ethr:rinkeby:0x209A6C9182Aa15Fe832aD759de28d98776caAFc3',
      keys: [key]
    }
    const importedDid = await agent.didManagerImport(identifier)
    return importedDid;
  } catch (e) {
    console.log(`Error: ${e}`)
  }
}

export const createMessage = (did: string, ) =>{ 
  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://beta.api.schemas.serto.id/v1/public/social-media-linkage-credential/1.0/ld-context.json",
    ],
    type: ["VerifiableCredential", "SocialMediaProfileLinkage"],
    issuer: did,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      test: "test",
      id: did,
    },
    credentialSchema: {
      id: "https://beta.api.schemas.serto.id/v1/public/social-media-linkage-credential/1.0/json-schema.json",
      type: "JsonSchemaValidator2018",
    },
    proof: {
      verificationMethod: did + "#controller",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      type: "EthereumEip712Signature2021",
    },
  };
}

export const domain = {
  chainId: 1,
  name: "Linkage",
  version: "1",
};

export const types = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
  ],
  VerifiableCredential: [
    {
      name: "@context",
      type: "string[]",
    },
    {
      name: "type",
      type: "string[]",
    },

    {
      name: "issuer",
      type: "string",
    },
    {
      name: "issuanceDate",
      type: "string",
    },
    {
      name: "credentialSubject",
      type: "CredentialSubject",
    },
    {
      name: "credentialSchema",
      type: "CredentialSchema",
    },
    {
      name: "proof",
      type: "Proof",
    },
  ],
  CredentialSchema: [
    {
      name: "id",
      type: "string",
    },
    {
      name: "type",
      type: "string",
    },
  ],
  CredentialSubject: [
    {
      name: "test",
      type: "string",
    },
    {
      name: "id",
      type: "string",
    },
  ],
  Proof: [
    {
      name: "verificationMethod",
      type: "string",
    },
    {
      name: "created",
      type: "string",
    },
    {
      name: "proofPurpose",
      type: "string",
    },
    {
      name: "type",
      type: "string",
    },
  ],
};

