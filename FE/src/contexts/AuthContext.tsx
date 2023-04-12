import React, {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '749214050502-jh7gvr9qkg8brc7esc486ndln4mdcltu.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
      console.log('USER:', user);
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Get the Google user data
      const {idToken} = await GoogleSignin.signIn({loginHint: 'google go'});

      // Create a Firebase credential with the Google ID token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with the Firebase credential
      const {user} = await auth().signInWithCredential(googleCredential);

      setUser(user);
    } catch (error) {
      console.error('AuthContext/signInWithGoogle:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('AuthContext/signOut:', error);
    }
  };

  return (
    <AuthContext.Provider value={{user, signInWithGoogle, signOut}}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
