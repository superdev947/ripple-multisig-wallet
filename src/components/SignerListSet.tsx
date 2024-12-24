import { FC, useState } from 'react'
import { toast } from 'react-toastify'
import { Wallet } from 'xrpl'
import { useRippleContext } from '@/context/RippleContext'

const SignerListSet: FC = () => {
  const { connect, client } = useRippleContext()
  const [loading, setLoading] = useState(false)
  const [signers, setSigners] = useState<string[]>([])
  const [newSigner, setNewSigner] = useState<string>('')
  const [mainWallet, setMainWallet] = useState<string>('')
  const [seed, setSeed] = useState<string>('')

  const addSigner = (): void => {
    if (signers.filter(s => s !== mainWallet).length >= 2) return
    if (newSigner && !signers.includes(newSigner)) {
      setSigners([...signers, newSigner])
      setNewSigner('')
    }
  }

  const removeSigner = (signer: string): void => {
    if (signer === mainWallet) setMainWallet('') // Clear main wallet if it's removed
    setSigners(signers.filter(s => s !== signer))
  }

  const handleSetMainWallet = (): void => {
    if (!seed) return
    const address = Wallet.fromSeed(seed).classicAddress
    if (!signers.includes(address)) {
      setSigners([...signers, address]) // Automatically add to signers if not present
    }
    setMainWallet(address)
  }

  const handleSubmit = async () => {
    try {
      if (!mainWallet) {
        toast.error('Please set a main wallet before submitting.')
        return
      }
      setLoading(true)
      await connect()
      const addresses = signers.filter(e => e !== mainWallet)
      const signerListSet = {
        TransactionType: 'SignerListSet',
        Account: mainWallet,
        SignerEntries: addresses.map(account => ({
          SignerEntry: {
            Account: account,
            SignerWeight: 1
          }
        })),
        SignerQuorum: addresses.length
      }
      await client?.submit(signerListSet as any, {
        wallet: Wallet.fromSeed(seed)
      })

      const masterKeyPairDisable = {
        TransactionType: 'AccountSet',
        Account: mainWallet,
        SetFlag: 4
      }
      await client?.submit(masterKeyPairDisable as any, {
        wallet: Wallet.fromSeed(seed)
      })
      toast.success('Signer list submitted successfully!')
      setSigners([])
      setNewSigner('')
      setMainWallet('')
      setSeed('')
    } catch (error) {
      console.log('error', error)
      toast.error('Internal error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {signers.length ? (
        <div className='mb-4'>
          <h2 className='text-lg font-medium text-gray-700 mb-2'>Current Signers:</h2>
          <ul className='space-y-2'>
            {signers.map((signer, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-3 rounded shadow-sm border border-gray-300 ${
                  signer === mainWallet ? 'bg-green-100 border-green-500' : 'bg-white'
                }`}
              >
                <span className='text-gray-800 truncate w-[200px]'>{signer}</span>
                <div className='flex space-x-2'>
                  {signer === mainWallet && (
                    <button className='px-2 py-1 text-sm font-medium rounded bg-green-500 text-white'>
                      Main Wallet
                    </button>
                  )}
                  <button
                    onClick={() => removeSigner(signer)}
                    className='text-red-500 hover:text-red-700 text-sm font-medium'
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        ''
      )}

      <div className='mt-4'>
        <h2 className='text-lg font-medium text-gray-700 mb-2'>Add New Signer:</h2>
        <div className='flex items-center space-x-2'>
          <input
            type='text'
            value={newSigner}
            onChange={e => setNewSigner(e.target.value)}
            placeholder='Enter Wallet address'
            className='flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300'
          />
          <button
            disabled={!newSigner}
            onClick={addSigner}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none disabled:bg-blue-gray-300'
          >
            Add
          </button>
        </div>
      </div>

      <div className='mt-4'>
        <h2 className='text-lg font-medium text-gray-700 mb-2'>Set Main Wallet by Seed:</h2>
        <div className='flex items-center space-x-2'>
          <input
            type='password'
            value={seed}
            onChange={e => setSeed(e.target.value)}
            placeholder='Enter Seed'
            className='flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300'
          />
          <button
            disabled={!seed}
            onClick={handleSetMainWallet}
            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none disabled:bg-blue-gray-300'
          >
            Set Main Wallet
          </button>
        </div>
      </div>

      <div className='mt-6'>
        <button
          disabled={loading || !seed || !signers.length}
          onClick={handleSubmit}
          className='w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none relative flex justify-center gap-2 items-center disabled:bg-blue-gray-300'
        >
          {loading && (
            <svg
              className='w-5 h-5 animate-spin text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          )}
          {loading ? 'Loading...' : 'Submit Signer List'}
        </button>
      </div>
    </>
  )
}

export default SignerListSet
