import { Client, xrpToDrops } from 'xrpl'

export const client = new Client('wss://s.altnet.rippletest.net:51233')

export const connectToRipple = async () => {
  if (!client.isConnected()) {
    await client.connect()
  }
}

export const disconnectFromRipple = async () => {
  if (client.isConnected()) {
    await client.disconnect()
  }
}

export const submitTransaction = async (signedTransaction: string): Promise<any> => {
  try {
    await connectToRipple()

    console.log('Submitting transaction...')

    const result = await client.submit(signedTransaction)
    console.log('Transaction result:', result)

    await client.disconnect()

    return result
  } catch (error) {
    console.error('Error submitting transaction:', error)
    await client.disconnect()
    throw new Error('Failed to submit the transaction.')
  }
}

export const prepareTransaction = async (
  address: string,
  destination: string,
  amount: string,
  issuer: string,
  currency: string
) => {
  await connectToRipple()
  if (currency === 'XRP') {
    return client.prepareTransaction({
      TransactionType: 'Payment',
      Account: address,
      Destination: destination,
      DestinationTag: 2024,
      Fee: '30',
      Amount: xrpToDrops(amount)
    })
  } else {
    return await client.prepareTransaction({
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
