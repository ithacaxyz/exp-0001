# EXP-0001: Account Delegation with EIP-7702

https://github.com/user-attachments/assets/f061c220-1be6-4287-b5df-e5636d928565

[Read the Blog Post](https://www.ithaca.xyz/updates/exp-0001)

## Overview

Exploration of utilizing [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) to designate an experimental Delegation Contract (with basic P256 Authorization & Batch Call capabilities) onto an EOA. This experiment also leverages a Sequencer to [enable sponsored transactions](https://ithaca.xyz/updates/exp-0000) via an `odyssey_sendTransaction` RPC method. 

## Getting Started

### Example 

```shell
# Install pnpm
$ curl -fsSL https://get.pnpm.io/install.sh | sh - 

$ pnpm install # Install modules
$ pnpm dev # Run
```

### Contracts

```shell
# Install Foundry
$ foundryup

$ forge build # Build
$ forge test # Test
```
