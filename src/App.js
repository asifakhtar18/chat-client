import axios from 'axios'
import './App.css'
import { UserContextProvider } from './userContext';
import Routes from './routes';

function App() {
  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;
  return (
    <div >
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  )
}

export default App;
