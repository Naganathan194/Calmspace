// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ColorHunter from './components/ColorHunter';
import FindOut from './components/FindOut';
import OddOneOutGame from './components/OddOneOutGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color-hunter" element={<ColorHunter />} />
        <Route path="/find-out" element={<FindOut />} />
        <Route path="/odd-one-out" element={<OddOneOutGame />} />
      </Routes>
    </Router>
  );
}

export default App;
