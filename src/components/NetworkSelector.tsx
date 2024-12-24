import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useRippleContext } from '@/context/RippleContext'

const NetworkSelector: FC = () => {
  const { setUrl, connect } = useRippleContext()
  const [selectedNetwork, setSelectedNetwork] = useState('testnet')

  const networks = [
    {
      value: 'mainnet',
      label: 'Mainnet',
      url: 'wss://xrplcluster.com'
    },
    {
      value: 'testnet',
      label: 'Testnet',
      url: 'wss://s.altnet.rippletest.net:51233'
    },
    {
      value: 'devnet',
      label: 'Devnet',
      url: 'wss://s.devnet.rippletest.net:51233'
    }
  ]

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedNetworkValue = event.target.value
    setSelectedNetwork(selectedNetworkValue)

    const network = networks.find(network => network.value === selectedNetworkValue)
    if (network) {
      setUrl(network.url)
    }
  }

  useEffect(() => {
    connect()
  }, [])

  return (
    <div className='flex items-center space-x-2 mt-2'>
      {/* <span
        className={`inline-flex items-center p-2 text-sm font-medium text-white rounded-full ${
          client?.isConnected() ? 'bg-green-500' : 'bg-red-500'
        }`}
      /> */}
      <select
        id='network'
        value={selectedNetwork}
        onChange={handleChange}
        className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
      >
        {networks.map(network => (
          <option key={network.value} value={network.value}>
            {network.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default NetworkSelector
