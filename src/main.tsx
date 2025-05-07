
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(<App />);

// Enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept();
}
