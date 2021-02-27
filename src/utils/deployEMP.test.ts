/**
 * @jest-environment node
 */

import { ethers } from 'ethers'
import { DAI, KOVAN_NETWORK, MAINNET_NETWORK, OneInchUSDPriceIdentifier } from '../constants'
import { EthereumAddress } from '../types'
import deployEMP, { EMPParameters } from './deployEMP'
import { Ganache } from './ganache'
import { kovanCollaterals } from './kovanCollaterals'
import { mainnetCollaterals } from './mainnetCollaterals'
import { getUMAAddresses } from './umaAddresses'

describe("Deploy EMP Tests", () => {
    let signer: ethers.Signer
    let network: ethers.providers.Network
    let ganacheInstance: Ganache
    let storeAddress: EthereumAddress

    beforeAll(async () => {
        ganacheInstance = new Ganache({
            port: 8549,
            gasLimit: 10000000
        })
        await ganacheInstance.start()

        const ganacheProvider = ganacheInstance.server.provider;
        const provider = new ethers.providers.Web3Provider(ganacheProvider)
        network = await provider.getNetwork()
        signer = provider.getSigner()

        storeAddress = getUMAAddresses(network.chainId).get('Store') as string
        if (!storeAddress) {
            throw new Error("Couldn't find the address")
        }
        console.log("Network", network)
    })

    afterAll(async () => {
        await ganacheInstance.stop()
    })

    const getCollaterals = () => {
        if (process.env.FORK_MODE === KOVAN_NETWORK) {
            return kovanCollaterals
        } else if (process.env.FORK_MODE === MAINNET_NETWORK) {
            return mainnetCollaterals
        } else {
            throw new Error("Not fork mode specified")
        }
    }

    test('that deploy EMP correctly', async () => {
        const daiCollateralInfo = getCollaterals().find(s => s.symbol === DAI)
        if (!daiCollateralInfo) {
            throw new Error("Couldn't find collateral info")
        }
        const values: EMPParameters = {
            expirationTimestamp: new Date(2022, 10, 10).getTime(),
            collateralAddress: daiCollateralInfo.address,
            priceFeedIdentifier: OneInchUSDPriceIdentifier,
            syntheticName: "yUMA-JUN2021",
            syntheticSymbol: "Yield UMA June",
            collateralRequirement: 125,
            minSponsorTokens: 100,
            liquidationLiveness: 7200,
            withdrawalLiveness: 7200,
            excessTokenBeneficiary: storeAddress
        }

        const receipt = await deployEMP(values, network, signer)

        // expect(receipt).toBeDefined()
    })
})