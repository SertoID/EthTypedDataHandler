import { getConfig } from '@veramo/cli/build/setup'
import { createObjects } from '@veramo/cli/build/lib/objectCreator'
import { Connection } from 'typeorm'
import fs from 'fs'

jest.setTimeout(30000)

// Shared tests
import myPluginLogic from './shared/myPluginLogic'

let dbConnection: Promise<Connection>
let agent: any

const createDid = async(agent: any) => {
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
      did: 'did:ethr:0x209A6C9182Aa15Fe832aD759de28d98776caAFc3',
      keys: [key]
    }
    const importedDid = await agent.didManagerImport(identifier)
    console.log(importedDid)
    return importedDid;
  } catch (e) {
    console.log(`Error: ${e}`)
  }
  
}
const setup = async (): Promise<boolean> => {

  const config = getConfig('./agent.yml')

  const { localAgent, db } = createObjects(config, { localAgent: '/agent', db: '/dbConnection' })
  agent = localAgent
  const importedDid = await createDid(agent);
  dbConnection = db

  return true
}

const tearDown = async (): Promise<boolean> => {
  await (await dbConnection).close()
  fs.unlinkSync('./database.sqlite')
  return true
}

const getAgent = () => agent

const testContext = { getAgent, setup, tearDown }

describe('Local integration tests', () => {
  myPluginLogic(testContext)
})
