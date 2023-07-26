import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/index.jsx";
import Progress from "./pages/progress.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route index element={<Home />} />
        <Route path="overview" element={<Home />} />
        <Route path="progress" element={<Progress />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
