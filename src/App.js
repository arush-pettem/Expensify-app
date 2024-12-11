import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignUpSignIn from "./components/Signup";
import Main from "./components/Pricing/Main";
import Contact from "./components/Contact";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Main/>} />
        <Route path="/contact" element={<Contact/>}/>
    
      </Routes>
    </Router>
  );
}

export default App;
