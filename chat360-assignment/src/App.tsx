import { MantineProvider } from '@mantine/core'
import ChatWindow from './components/Chat/ChatWindow'
import './index.scss'

function App() {
  return (
    <MantineProvider>
      <ChatWindow />
    </MantineProvider>
  )
}

export default App
