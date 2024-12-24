import { FC, FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Wallet } from 'xrpl'
import { useRippleContext } from '@/context/RippleContext'

const Sign: FC = () => {
  const { connect } = useRippleContext()
  const [seed, setSeed] = useState('')
  const [txJSON, setTxJSON] = useState('')
  const [txBlob, setTxBlob] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await connect()
      const { tx_blob: txBlob } = Wallet.fromSeed(seed).sign(JSON.parse(txJSON), true)
      setTxBlob(txBlob)
      toast.success('Transaction Sign successfully!')
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(txBlob).then(() => {
      setCopied(true)
    })
  }

  useEffect(() => {
    setCopied(false)
  }, [txBlob])

  return (
    <>
      <form onSubmit={handleSubmit} className='p-4 bg-gray-50 rounded shadow'>
        <h2 className='text-lg font-bold'>Transaction Sign</h2>
        <input
          type='password'
          placeholder='Enter Signer Seed'
          value={seed}
          onChange={e => setSeed(e.target.value)}
          className='w-full p-2 border rounded mt-3'
          required
        />
        <textarea
          className='mt-3 w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
          placeholder='Enter Transaction Json'
          rows={10}
          onChange={e => setTxJSON(e.target.value)}
          value={txJSON}
          required
        />
        <button
          disabled={loading || !seed || !txJSON}
          className='mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none relative flex justify-center gap-2 items-center disabled:bg-blue-gray-300'
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
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {txBlob && (
        <div className='mt-4 flex flex-col items-center space-y-4'>
          <textarea
            className='w-full max-w-lg p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Type something here...'
            rows={10}
            value={txBlob}
            readOnly
          />
          <button
            onClick={handleCopy}
            className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}
    </>
  )
}

export default Sign
