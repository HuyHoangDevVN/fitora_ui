import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignalRProvider } from "./context/SignalRContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignalRProvider>
        <RouterProvider router={router} />
      </SignalRProvider>
    </QueryClientProvider>
  );
}

export default App;
