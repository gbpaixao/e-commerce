import { toast } from 'react-toastify';
import Routes from './routes/index.routes';
// import './server';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
  autoClose: 4000,
  draggable: false,
  pauseOnFocusLoss: false,
});
function App(): JSX.Element {
  return (
    <Routes />
  );
}

export default App;
