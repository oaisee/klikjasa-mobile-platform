
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set up a global error handler to catch rendering errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

console.log('Main: Starting application initialization');

// Create root and render app
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  
  root.render(<App />);
  console.log('Main: Application successfully rendered');
} catch (err) {
  console.error('Failed to render application:', err);
}
