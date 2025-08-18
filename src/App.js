import { ToastContainer } from "react-toastify";
import Rotas from "./routes/Rotas";

function App() {
  return (
    <>
      <ToastContainer toastStyle={{width: '80%', maxWidth: 600, minWidth: 350}}/>
      <Rotas />
    </>
  );
}

export default App;
