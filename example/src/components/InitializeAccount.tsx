import { Hooks } from 'porto/wagmi'
import type { BaseError } from 'viem'
import { useAccount, useConnectors } from 'wagmi'
import { client } from '../config'

export function InitializeAccount() {
  const label = `exp-000q-${Math.floor(Date.now() / 1000)}`

  const { address } = useAccount()
  const connect = Hooks.useConnect()
  const connectors = useConnectors()
  const connector = connectors.find((x) => x.id === 'xyz.ithaca.porto')!

  return (
    <div>
      <button
        disabled={connect.isPending}
        onClick={() =>
          connect.mutate({
            connector,
            createAccount: { label },
          })
        }
        type="button"
      >
        Register
      </button>
      <button
        disabled={connect.isPending}
        onClick={() => connect.mutate({ connector })}
        type="button"
      >
        Sign In
      </button>
      {address && (
        <p>
          Account created!{' '}
          <a
            href={`${client.chain.blockExplorers.default.url}/address/${address}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </p>
      )}
      {connect.error && (
        <p>
          {(connect.error as BaseError).shortMessage ?? connect.error.message}
        </p>
      )}
    </div>
  )
}
