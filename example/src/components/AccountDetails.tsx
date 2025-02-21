import { type Address, formatEther } from 'viem'
import { useReadContract } from 'wagmi'
import { client } from '../config'
import { ExperimentERC20 } from '../contracts'

export function AccountDetails({ address }: { address: Address }) {
  const { data: expBalance } = useReadContract({
    abi: ExperimentERC20.abi,
    address: ExperimentERC20.address[0],
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 1000,
    },
  })

  return (
    <div>
      <div>
        <strong>Address:</strong> <code>{address}</code> {' · '}
        <a
          href={`${client.chain.blockExplorers.default.url}/address/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          Explorer
        </a>
      </div>
      <div>
        <strong>Balance:</strong>{' '}
        {typeof expBalance === 'bigint' && (
          <code>{formatEth(expBalance)} EXP (ERC20)</code>
        )}
      </div>
    </div>
  )
}

const numberIntl = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 6,
})

export function formatEth(wei: bigint) {
  return numberIntl.format(Number(formatEther(wei)))
}
