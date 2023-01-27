import * as React from "react";
import {
  useNavigate,
  useLocation,
  Navigate,
  Link
} from "react-router-dom";

/***************************************************************************************
 * SEE https://github.com/remix-run/react-router/tree/dev/examples/auth FOR EXAMPLE USED
 **************************************************************************************/

/**
 * This represents some generic auth provider API, like Firebase.
 * It should be replaced in favor of an actual auth provider.
 */
export const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};


/**
 * AUTH PROVIDER
 */

export interface AuthContextType {
  user: any;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

// Auth context used by the AuthProvider
const AuthContext = React.createContext<AuthContextType>(null!);

/**
 * App Access to the AuthContext Provider.  
 * NOTE: This might have to change slightly if the faked provider is too simple.
 * 
 * @param param0 
 * @returns 
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  const signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  return <AuthContext.Provider value={{user, signin, signout}}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook to access auth context within components
 * @returns 
 */
export const useAuth = () => React.useContext(AuthContext);

/**
 * Auth Status
 * 
 * @returns 
 */
export function AuthStatus() {
  const auth = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    auth.signout(() => navigate("/login"));
  }

  if (!auth.user) {
    return (
      <>
        <p>You are not logged in.</p>
        <Link to="/login">Login</Link>
      </>
    );
  }

  return (
    <p>
      Welcome {auth.user}!{" "}
      <button onClick={signOut}>
        Sign out
      </button>
    </p>
  );
}

/**
 * RequireAuth is to be used to wrap around other components.  If user is logged in, children 
 * are displayed but if the user is not logged in, react-router will redirect to the login page.
 * 
 * @param children - child elements to show if user is authenticated. 
 * @returns 
 */
export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}