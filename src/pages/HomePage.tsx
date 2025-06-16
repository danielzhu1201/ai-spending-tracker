import { useState, useEffect } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../Viewport.css";

function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Handle errors here, such as displaying a notification to the user
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting the user to null
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  if (loading) {
    return <p>Loading authentication status...</p>;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Welcome to AI Spending Tracker</h1>
      <div className="card">
        {user ? (
          <>
            <p>Hello, {user.displayName || user.email}!</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleGoogleLogin}>Login with Google</button>
        )}
      </div>
    </>
  );
}
export default HomePage;
