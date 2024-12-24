import { FC, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { multisign } from 'xrpl'
import { IoMdTrash } from 'react-icons/io'
import { useRippleContext } from '@/context/RippleContext'

const Submit: FC = () => {
  const { connect, client } = useRippleContext()
  const [loading, setLoading] = useState(false)
  const [txBlobs, setTxBlobs] = useState<string[]>([''])

  const handleAddBlob = () => {
    setTxBlobs([...txBlobs, ''])
  }

  const handleRemoveBlob = (index: number) => {
    setTxBlobs(txBlobs.filter((_, i) => i !== index))
  }

  const handleBlobChange = (index: number, value: string) => {
    const newTxBlobs = [...txBlobs]
    newTxBlobs[index] = value
    setTxBlobs(newTxBlobs)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await connect()
      if (!client) return
      const multisignedTx = multisign(txBlobs)
      const result = await client.submit(multisignedTx)
      console.log('result', result.result.engine_result)
      if (result.result.engine_result === 'tesSUCCESS') {
        toast.success('Transaction successfully!')
      } else {
        toast.error(result.result.engine_result_message)
      }
    } catch (error) {
      toast.error('Transaction error!')
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='p-4 bg-gray-50 rounded shadow'>
      <h2 className='text-lg font-bold'>Submit Transaction</h2>
      {txBlobs.map((txBlob, index) => (
        <div key={index} className='mt-4 relative'>
          <textarea
            className='w-full max-w-lg p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={`Enter Transaction Blob ${index + 1}`}
            rows={5}
            value={txBlob}
            onChange={e => handleBlobChange(index, e.target.value)}
            required
          />
          {txBlobs.length > 1 && (
            <button
              type='button'
              onClick={() => handleRemoveBlob(index)}
              className='absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none'
              aria-label={`Remove Blob ${index + 1}`}
            >
              <IoMdTrash size={24} />
            </button>
          )}
        </div>
      ))}
      <button
        type='button'
        className='mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none'
        onClick={handleAddBlob}
      >
        Add Transaction Blob
      </button>
      <button
        disabled={loading || txBlobs.some(blob => !blob)}
        className='mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none relative flex justify-center gap-2 items-center disabled:bg-blue-gray-300'
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
  )
}

export default Submit
