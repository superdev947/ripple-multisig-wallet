# Ripple Multisig Wallet

A Chrome extension for managing multisignature wallets on the XRP Ledger (XRPL). This tool provides a user-friendly interface for creating tokens, setting up signer lists, preparing transactions, signing, and submitting multisig transactions on the Ripple network.

## Features

- **Token Issuance**: Create and issue custom tokens on the XRP Ledger
- **Signer List Management**: Set up and configure multisignature wallets with multiple signers
- **Transaction Preparation**: Prepare transactions for multisig approval
- **Transaction Signing**: Sign prepared transactions with individual signer accounts
- **Transaction Submission**: Submit fully signed multisig transactions to the network
- **Network Selection**: Switch between Mainnet, Testnet, and Devnet
- **Chrome Extension**: Easy access through browser extension interface

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS & SCSS
- **XRPL Integration**: xrpl.js library v4.0.0
- **UI Components**: React Icons, React Toastify
- **Build Tools**: Webpack 5
- **Code Quality**: ESLint, Prettier

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Chrome browser (for extension testing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/superdev947/ripple-multisig-wallet.git
cd ripple-multisig-wallet
```

2. Install dependencies:
```bash
npm install
```

## Development

### Run Development Server

Start the development server with hot reload:
```bash
npm run dev
```

This will open the application in your default browser at `http://localhost:8080`.

### Build for Production

Build the Chrome extension:
```bash
npm run build
```

The built extension will be available in the `dist` directory.

### Watch Mode

Build and watch for changes:
```bash
npm run watch
```

### Code Quality

Lint the code:
```bash
npm run lint
```

Format the code:
```bash
npm run format
```

## Loading the Chrome Extension

1. Build the extension using `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `dist` directory from your project

## Usage Guide

### 1. Issue Token

Create a new token on the XRP Ledger:

- Enter the **Main Seed** (hot wallet that will hold tokens)
- Enter the **Issue Seed** (cold wallet that will issue tokens)
- Set the **Domain** for the issuer
- Define the **Currency** code (3-letter or hex format)
- Set the **Large Limit** for the trust line
- Specify the **Issue Quantity** to mint

The process will:
- Configure the issuer account settings
- Set up the main wallet with required auth
- Create a trust line between wallets
- Issue the specified quantity of tokens

### 2. SignerListSet

Configure a multisignature wallet:

1. Add signer addresses manually or use "Add New Signer"
2. Set the main wallet using the seed phrase
3. Configure signer quorum (minimum signatures required)
4. Submit to disable the master key and enable multisig

**Note**: You need at least 2 signers (excluding the main wallet) to create a valid multisig setup.

### 3. TXN Prepare

Prepare a transaction for signing:

- Enter transaction details (destination, amount, etc.)
- The transaction is serialized and prepared for signing
- Copy the prepared transaction blob for distribution to signers

### 4. TXN Sign

Sign a prepared transaction:

- Paste the prepared transaction blob
- Enter the signer's seed phrase
- Sign the transaction
- Export the signature for submission

### 5. Submit

Submit a fully signed multisig transaction:

- Gather all required signatures
- Paste the signed transaction blob
- Submit to the XRP Ledger
- Monitor transaction result

## Network Configuration

The wallet supports three networks:

- **Mainnet**: `wss://xrplcluster.com/`
- **Testnet**: `wss://s.altnet.rippletest.net:51233` (default)
- **Devnet**: `wss://s.devnet.rippletest.net:51233`

Use the Network Selector dropdown to switch between networks.

## Project Structure

```
ripple-multisig-wallet/
├── src/
│   ├── components/          # React components
│   │   ├── Issue.tsx        # Token issuance
│   │   ├── SignerListSet.tsx # Multisig setup
│   │   ├── Prepare.tsx      # Transaction preparation
│   │   ├── Sign.tsx         # Transaction signing
│   │   ├── Submit.tsx       # Transaction submission
│   │   └── NetworkSelector.tsx # Network switcher
│   ├── context/
│   │   └── RippleContext.tsx # XRPL client context
│   ├── pages/
│   │   └── MultisigWallet.tsx # Main page
│   ├── service/
│   │   └── index.ts         # Service utilities
│   ├── App.tsx              # Root component
│   ├── index.tsx            # Entry point
│   └── index.scss           # Global styles
├── public/
│   └── index.html           # HTML template
├── manifest.json            # Chrome extension manifest
├── webpack.config.js        # Webpack dev config
├── webpack-build.config.js  # Webpack production config
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
