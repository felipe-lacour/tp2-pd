import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const { user, 
    loginWithGoogle, 
    isRegistering, 
    error, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    confirmPassword, 
    setConfirmPassword, 
    handleRegister, 
    handleLoginWithEmail, 
    setIsRegistering } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);


  return (
    <div style={{ margin: '50px' }}>
      <h2>{isRegistering ? 'Registro' : 'Iniciar Sesión'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {isRegistering && (
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}

      <div style={{ marginBottom: '10px' }}>
        {isRegistering ? (
          <button onClick={handleRegister}>Registrar</button>
        ) : (
          <button onClick={handleLoginWithEmail}>Iniciar Sesión</button>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={loginWithGoogle}>Login con Google</button>
      </div>

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
};

export default LoginPage;