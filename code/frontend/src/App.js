import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000')
      .then(res => setMensagem(res.data))
      .catch(err => console.error(err));
  }, []);

  return <h1>{mensagem}</h1>;
}

export default App;
