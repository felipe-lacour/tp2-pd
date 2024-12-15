// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Asegúrate que en este archivo solo exportes auth desde getAuth(app)
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleAuthAction = () => {
    if (user) {
        logoutUser();
    } else {
        window.location.href = '/login';
    }
};

const handleRegister = async () => {
  if (password !== confirmPassword) {
    setError('Las contraseñas no coinciden.');
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  } catch (err) {
    setError('Error registrando usuario: ' + err.message);
  }
};

const handleLoginWithEmail = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail('');
    setPassword('');
    setError('');
  } catch (err) {
    setError('Error iniciando sesión: ' + err.message);
  }
};
  const value = {
    user,
    loginWithGoogle,
    logoutUser,
    handleAuthAction,
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
    setIsRegistering
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};