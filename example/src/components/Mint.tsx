import { type BaseError, parseEther } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import { client } from '../config'
import { ExperimentERC20 } from '../contracts'

export function Mint() {
  const { address } = useAccount()

  const send = useSendCalls()

  return (
    <div>
      <p>Mint some EXP (ERC20) to your account by clicking the button below.</p>
      <button
        disabled={send.isPending}
        onClick={(event) => {
          event.preventDefault()
          send
            .sendCallsAsync({
              account: address!,
              calls: [
                {
                  functionName: 'mint',
                  abi: ExperimentERC20.abi,
                  to: ExperimentERC20.address[0],
                  args: [address!, parseEther('100')],
                },
              ],
            })
            .then((result) => {
              console.log(result)
            })
            .catch((error) => {
              console.error(error)
            })
        }}
        type="button"
      >
        {send.isPending ? 'Minting...' : 'Mint 100 EXP'}
      </button>
      {send.error && (
        <p>{(send.error as BaseError).shortMessage ?? send.error.message}</p>
      )}
      {send.isSuccess && (
        <p>
          Minted 100 EXP ·{' '}
          <a
            href={`${client.chain.blockExplorers.default.url}/tx/${send.data}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </p>
      )}
    </div>
  )
}
