import { FC, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { AccountSet, AccountSetAsfFlags, AccountSetTfFlags, convertStringToHex, Payment, TrustSet, Wallet } from 'xrpl'
import { useRippleContext } from '@/context/RippleContext'

const Issue: FC = () => {
  const { connect, client } = useRippleContext()
  const [loading, setLoading] = useState(false)
  const [main, setMain] = useState('')
  const [issue, setIssue] = useState('')
  const [domain, setDomain] = useState('')
  const [currency, setCurrency] = useState('')
  const [largeLimit, setLargeLimit] = useState('')
  const [issueQuantity, setIssueQuantity] = useState('')
  const [showMainPassword, setShowMainPassword] = useState(false)
  const [showIssuePassword, setShowIssuePassword] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await connect()
      if (!client) return
      const issueWallet = Wallet.fromSeed(issue)
      const mainWallet = Wallet.fromSeed(main)

      const issue_settings_tx = {
        TransactionType: 'AccountSet',
        Account: issueWallet.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: convertStringToHex(domain),
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
        Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag
      }

      const cst_prepared = await client.autofill(issue_settings_tx as AccountSet)
      const cst_signed = issueWallet.sign(cst_prepared)
      console.log('Sending cold address AccountSet transaction...')
      const cst_result = await client.submitAndWait(cst_signed.tx_blob)
      console.log('cst_result', cst_result)

      const hot_settings_tx = {
        TransactionType: 'AccountSet',
        Account: mainWallet.address,
        Domain: convertStringToHex(domain),
        SetFlag: AccountSetAsfFlags.asfRequireAuth,
        Flags: AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag
      }

      const hst_prepared = await client.autofill(hot_settings_tx as AccountSet)
      const hst_signed = mainWallet.sign(hst_prepared)
      console.log('Sending hot address AccountSet transaction...')
      const hst_result = await client.submitAndWait(hst_signed.tx_blob)
      console.log('hst_result', hst_result)

      const trust_set_tx = {
        TransactionType: 'TrustSet',
        Account: mainWallet.address,
        LimitAmount: {
          currency,
          issuer: issueWallet.address,
          value: largeLimit // Large limit, arbitrarily chosen
        }
      }

      const ts_prepared = await client.autofill(trust_set_tx as TrustSet)
      const ts_signed = mainWallet.sign(ts_prepared)
      console.log('Creating trust line from hot address to issuer...')
      const ts_result = await client.submitAndWait(ts_signed.tx_blob)
      console.log('ts_result', ts_result)

      const send_token_tx = {
        TransactionType: 'Payment',
        Account: issueWallet.address,
        Amount: {
          currency,
          value: issueQuantity,
          issuer: issueWallet.address
        },
        Destination: mainWallet.address,
        DestinationTag: 1
      }

      const pay_prepared = await client.autofill(send_token_tx as Payment)
      const pay_signed = issueWallet.sign(pay_prepared)
      console.log(`Cold to hot - Sending ${issueQuantity} ${currency} to ${mainWallet.address}...`)
      const pay_result = await client.submitAndWait(pay_signed.tx_blob)
      console.log('pay_result', pay_result)

      toast.success('Token create successfully!')
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='p-4 bg-gray-50 rounded shadow'>
        <h2 className='text-lg font-bold'>Issue Token</h2>
        <div className='relative mt-4'>
          <input
            type={showMainPassword ? 'text' : 'password'}
            placeholder='Enter Main Seed'
            value={main}
            onChange={e => setMain(e.target.value)}
            className='w-full p-2 border rounded'
            required
          />
          <button
            type='button'
            onClick={() => setShowMainPassword(!showMainPassword)}
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            {showMainPassword ? <IoMdEyeOff size={24} /> : <IoMdEye size={24} />}
          </button>
        </div>
        <div className='relative mt-4'>
          <input
            type={showIssuePassword ? 'text' : 'password'}
            placeholder='Enter Issue Seed'
            value={issue}
            onChange={e => setIssue(e.target.value)}
            className='w-full p-2 border rounded'
            required
          />
          <button
            type='button'
            onClick={() => setShowIssuePassword(!showIssuePassword)}
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            {showIssuePassword ? <IoMdEyeOff size={24} /> : <IoMdEye size={24} />}
          </button>
        </div>
        <input
          type='text'
          placeholder='Enter Domain'
          value={domain}
          onChange={e => setDomain(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <input
          type='text'
          placeholder='Enter Currency'
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <input
          type='number'
          placeholder='Enter Large Limit'
          value={largeLimit}
          onChange={e => setLargeLimit(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <input
          type='number'
          placeholder='Enter Issue Quantity'
          value={issueQuantity}
          onChange={e => setIssueQuantity(e.target.value)}
          className='w-full p-2 border rounded mt-4'
          required
        />
        <button
          disabled={loading}
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
    </>
  )
}

export default Issue
