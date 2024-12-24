import React, { createContext, useContext, useState, useEffect } from 'react'
import { Client } from 'xrpl'

interface RippleContextType {
  client: Client | null
  url: string
  setUrl: (url: string) => void
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const RippleContext = createContext<RippleContextType | undefined>(undefined)

export const RippleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [url, setUrl] = useState('wss://s.altnet.rippletest.net:51233')
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const newClient = new Client(url)
    setClient(newClient)
    return () => {
      newClient.disconnect()
    }
  }, [url])

  const connect = async () => {
    if (client && !client.isConnected()) {
      await client.connect()
    }
  }

  const disconnect = async () => {
    if (client && client.isConnected()) {
      await client.disconnect()
    }
  }

  console.log(url)

  return (
    <RippleContext.Provider value={{ client, url, setUrl, connect, disconnect }}>{children}</RippleContext.Provider>
  )
}

export const useRippleContext = () => {
  const context = useContext(RippleContext)
  if (!context) {
    throw new Error('useRippleContext must be used within a RippleProvider')
  }
  return context
}
