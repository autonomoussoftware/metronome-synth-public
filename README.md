# Vesper Synth

This repository contains set of smart contracts and test cases of Vesper Synth

## Setup

1. Install

   ```sh
   npm i
   ```

2. set NODE_URL in env

   ```sh
   export NODE_URL=<eth mainnet url>
   ```

   or by creating a `.env` file (use `.env.template` as reference)

3. Test

```sh
npm t
```

## Run test with coverage

```sh
npm run coverage
```

### Deploy

Setup the env vars properly (See `.env.template` file)

```
$ npm run deploy -- --gasprice <gas price in wei> --network <network>
```
