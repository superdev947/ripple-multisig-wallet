import { FC, useState } from 'react'
import Issue from '@/components/Issue'
import SignerListSet from '@/components/SignerListSet'
import Prepare from '@/components/Prepare'
import Sign from '@/components/Sign'
import Submit from '@/components/Submit'
import NetworkSelector from '@/components/NetworkSelector'

const tabs = [
  { id: 0, label: 'Issue', content: <Issue /> },
  { id: 1, label: 'SignerListSet', content: <SignerListSet /> },
  { id: 2, label: 'TXN Prepare', content: <Prepare /> },
  { id: 3, label: 'TXN Sign', content: <Sign /> },
  { id: 4, label: 'Submit', content: <Submit /> }
]

const MultisigWallet: FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className='max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl font-semibold text-gray-800'>Multisig Wallet</h1>
        <NetworkSelector />
      </div>

      {/* Tab Buttons */}
      <div className='flex border-b border-gray-300'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 text-center ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500 font-semibold'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tabs.map((item, index) => (
        <div
          key={index}
          className={`p-4 bg-white border border-gray-200 rounded-b-lg  ${activeTab === item.id ? 'block' : 'hidden'}`}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}

export default MultisigWallet
