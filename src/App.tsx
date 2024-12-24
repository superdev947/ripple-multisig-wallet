import { FC } from 'react'
import { ToastContainer } from 'react-toastify'
import MultisigWallet from './pages/MultisigWallet'
import { RippleProvider } from './context/RippleContext'

const App: FC = () => {
  return (
    <RippleProvider>
      <MultisigWallet />
      <ToastContainer />
    </RippleProvider>
  )
}

export default App
