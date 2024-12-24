import { FC, FormEvent, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { dropsToXrp, xrpToDrops } from 'xrpl'
import { useRippleContext } from '@/context/RippleContext'

interface Token {
  account: string
  balance: string
  currency: string
}

const Prepare: FC = () => {
  const { connect, client } = useRippleContext()
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [main, setMain] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [txJSON, setTxJSON] = useState('')
  const [token, setToken] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])

  const currency = useMemo(() => tokens.find(e => e.account === token)?.currency || '', [token, tokens])

  const prepareTransaction = async (
    address: string,
    destination: string,
    amount: string,
    issuer: string,
    currency: string
  ) => {
    if (currency === 'XRP') {
      return client?.prepareTransaction({
        TransactionType: 'Payment',
        Account: address,
        Destination: destination,
        DestinationTag: 2024,
        Fee: '30',
        Amount: xrpToDrops(amount)
      })
    } else {
      return await client?.prepareTransaction({
        TransactionType: 'Payment',
        Account: address,
        Destination: destination,
        DestinationTag: 2024,
        Fee: '30',
        Amount: {
          currency: currency,
          value: amount,
          issuer
        }
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await connect()
      const prepared = await prepareTransaction(main, recipient, amount, token, currency)
      setTxJSON(JSON.stringify(prepared, null, 2))
      toast.success('Prepare Transaction successfully!')
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(txJSON).then(() => {
      setCopied(true)
    })
  }

  const getBalance = async () => {
    await connect()
    if (!client) return
    const response1 = await client.request({
      command: 'account_lines',
      account: main
    })

    const response2 = await client.request({
      command: 'account_info',
      account: main,
      ledger_index: 'validated'
    })

    const balanceInDrops = dropsToXrp(response2.result.account_data.Balance)
    setTokens([
      ...response1.result.lines.map(token => ({
        currency: token.currency,
        balance: token.balance,
        account: token.account
      })),
      { currency: 'XRP', balance: balanceInDrops.toFixed(2), account: 'XRP' }
    ])
  }

  useEffect(() => {
    if (main && main.length === 34) getBalance()
  }, [main])

  useEffect(() => {
    setCopied(false)
  }, [txJSON])

  return (
    <>
      <form onSubmit={handleSubmit} className='p-4 bg-gray-50 rounded shadow'>
        <h2 className='text-lg font-bold'>Transaction Prepare</h2>
        <input
          type='text'
          placeholder='Enter Sender Address'
          value={main}
          onChange={e => setMain(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <input
          type='text'
          placeholder='Enter Recipient Address'
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <select
          id='custom-select'
          value={token}
          onChange={e => setToken(e.target.value)}
          className='w-full px-2 py-3 border rounded mt-4'
        >
          <option value='' disabled className='text-gray-400'>
            Choose an token
          </option>
          {tokens.map((token, index) => (
            <option key={index} value={token.account} className='text-gray-800 hover:bg-gray-100'>
              {token.currency} ({token.balance})
            </option>
          ))}
        </select>
        <input
          type='number'
          placeholder={`Enter Amount (${currency})`}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <button
          disabled={loading || !main || !recipient || !amount}
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
      {txJSON && (
        <div className='mt-4 flex flex-col items-center space-y-4'>
          <textarea
            className='w-full max-w-lg p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Type something here...'
            rows={15}
            value={txJSON}
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

export default Prepare
