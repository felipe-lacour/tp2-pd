import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css"


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
    <div className='loginpage'>
      {error && <p>{error}</p>}
      <div className='loginpage-div'>
      <h2>{isRegistering ? 'Registro' : 'Iniciar Sesión'}</h2>
        <form action="/player">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          {isRegistering && (
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
          )}
            {isRegistering ? (
              <button type='submit' onClick={(e) => {
                e.preventDefault()
                handleRegister()
              }}>Registrar</button>
            ) : (
              <button type='submit' onClick={(e) => {
                e.preventDefault()
                handleLoginWithEmail()
              }}>Iniciar Sesión</button>
            )}
        </form>
        <div>
          <button onClick={loginWithGoogle} className='google-button'>
            <img src="/res/img/google.svg" alt="google" />
            Login con Google
          </button>
        </div>
        <button onClick={() => setIsRegistering(!isRegistering)} className='register-button'>
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;