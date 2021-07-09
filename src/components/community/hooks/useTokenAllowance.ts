import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import ERC20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import { Token } from "temporaryData/types"

const MAX_VALUE = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

const getAllowance = async (_, tokenContract, account, contractAddress) => {
  const allowance = await tokenContract.allowance(account, contractAddress)
  return allowance >= MAX_VALUE / BigInt(4)
}

const useTokenAllowance = (token: Token): any => {
  const { account } = useWeb3React()
  const {
    chainData: {
      contract: { address: contractAddress },
    },
  } = useCommunity()
  const tokenContract = useContract(token.address, ERC20_ABI, true)

  const shouldFetch = typeof account === "string" && !!tokenContract

  const result = useSWR(
    shouldFetch
      ? [`${token.name}_allowance`, tokenContract, account, contractAddress]
      : null,
    getAllowance
  )

  useKeepSWRDataLiveAsBlocksArrive(result.mutate)

  const allowToken = async () => {
    const tx = await tokenContract.approve(contractAddress, MAX_VALUE)
    return tx
  }

  const { data } = result
  return [data, allowToken]
}

export default useTokenAllowance