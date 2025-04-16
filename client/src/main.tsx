import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Custom styles to match the design reference
const style = document.createElement('style');
style.textContent = `
  body {
    background-color: #0b0f19;
    color: #e2e8f0;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .glass-effect {
    background: rgba(17, 25, 40, 0.75);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.125);
  }
`;

document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
