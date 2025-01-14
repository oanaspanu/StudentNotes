import Header from "./components/Header";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NoteListPage from "./pages/NoteListPage";
import NotePage from "./pages/NotePage";

function App() {
const myName = "Bianca";

  return  (
    <Router>
      <div className="container">
       <div className="app">
        <Header/>
         <Routes>
          <Route path="/" element={<NoteListPage/>}/>
          <Route path="/note/:id" element={<NotePage/>}/>
        </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
