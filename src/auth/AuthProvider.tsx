import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    // Fake authentication logic
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating delay

    // Replace with actual authentication logic (e.g., API call)
    if (username === "admin" && password === "password") {
      setUser(username);
    } else {
      throw new Error("Invalid username or password");
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
