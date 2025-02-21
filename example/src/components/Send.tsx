import { type Address, encodeFunctionData, formatEther, parseEther } from 'viem'
import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'
import { useAccount, useReadContracts } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import { client } from '../config'
import { ExperimentERC20 } from '../contracts'

const alice = privateKeyToAddress(generatePrivateKey())
const bob = privateKeyToAddress(generatePrivateKey())

export function Send() {
  const { address } = useAccount()

  const { data: balances } = useReadContracts({
    contracts: [
      {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0] as Address,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0] as Address,
        functionName: 'balanceOf',
        args: [alice],
      },
      {
        abi: ExperimentERC20.abi,
        address: ExperimentERC20.address[0] as Address,
        functionName: 'balanceOf',
        args: [bob],
      },
    ],
    query: {
      enabled: !!address,
      refetchInterval: 1_000,
    },
  })

  const send = useSendCalls()

  const [selfBalance, aliceBalance, bobBalance] = balances || []
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const aliceValue = formData.get('value.alice') as string
        const bobValue = formData.get('value.bob') as string

        send.sendCalls({
          calls: [
            {
              to: ExperimentERC20.address[0],
              data: encodeFunctionData({
                abi: ExperimentERC20.abi,
                functionName: 'transfer',
                args: [alice, parseEther(aliceValue)],
              }),
            },
            {
              to: ExperimentERC20.address[0],
              data: encodeFunctionData({
                abi: ExperimentERC20.abi,
                functionName: 'transfer',
                args: [bob, parseEther(bobValue)],
              }),
            },
          ],
        })

        form.reset()
      }}
    >
      <p>Send EXP (ERC20) to other accounts by filling out the fields below.</p>
      <table>
        <thead>
          <tr>
            <th align="left">Recipient</th>
            <th align="right" style={{ width: '80px' }}>
              Balance
            </th>
            <th style={{ width: '120px' }} />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td align="right">{formatExp(aliceBalance?.result)} EXP</td>
            <td align="right">
              <input
                disabled={selfBalance?.result === 0n || send.isPending}
                required
                max={formatExp(selfBalance?.result)}
                step="0.000001"
                type="number"
                name="value.alice"
                style={{ width: '100px' }}
              />
            </td>
          </tr>
          <tr>
            <td>Bob</td>
            <td align="right">{formatExp(bobBalance?.result)} EXP</td>
            <td align="right">
              <input
                disabled={selfBalance?.result === 0n || send.isPending}
                required
                max={formatExp(selfBalance?.result)}
                step="0.000001"
                type="number"
                name="value.bob"
                style={{ width: '100px' }}
              />
            </td>
          </tr>
          <tr>
            <td>Self</td>
            <td align="right">{formatExp(selfBalance?.result)} EXP</td>
            <td align="right">
              <button
                disabled={selfBalance?.result === 0n || send.isPending}
                type="submit"
              >
                Send
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {send.status === 'pending' && <p>Waiting for receipt...</p>}
      {send.isSuccess && (
        <p>
          Transaction successful!{' '}
          <a
            href={`${client.chain.blockExplorers.default.url}/tx/${send.data}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </p>
      )}
    </form>
  )
}

const numberIntl = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 6,
})

export function formatExp(wei: bigint | undefined) {
  if (!wei) return '0'
  return numberIntl.format(Number(formatEther(wei)))
}
