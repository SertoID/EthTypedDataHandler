
export const message = (did: string, ) =>{ 
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
      name: "socialMediaProfileUrl",
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

