// App.jsx — React Router setup with shared Navbar layout
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dataset from './pages/Dataset';
import Predict from './pages/Predict';
import ModelInfo from './pages/ModelInfo';
import Metrics from './pages/Metrics';
import Compare from './pages/Compare';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/dataset" element={<Dataset />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/model"   element={<ModelInfo />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}
