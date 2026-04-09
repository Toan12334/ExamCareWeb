

import AppRouter from "./routers/AppRouter"
import ToastProvider from "./components/ui/ToastProvider"
function App() {
  return (
    <div>
      <ToastProvider />
      <AppRouter />
    </div>
  )
}

export default App