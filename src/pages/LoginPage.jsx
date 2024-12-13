import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { loginWithGoogle, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Navega sólo después de que el componente se haya montado/renderizado
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    await loginWithGoogle();
    // No es necesario redirigir aquí, el efecto se ocupará cuando user cambie
  };

  // Si el usuario no está logueado, mostramos el botón de login
  if (!user) {
    return (
      <div style={{ margin: '50px' }}>
        <h2>Iniciar Sesión con Google</h2>
        <button onClick={handleLogin}>Login con Google</button>
      </div>
    );
  }

  // Si el usuario está logueado, podemos incluso retornar nulo porque el useEffect redirigirá
  return null;
};

export default LoginPage;