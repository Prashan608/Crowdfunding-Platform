import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import useSocketNotifications from "./hooks/useSocketNotifications";
import ChatWidget from "./components/aichat/ChatWidget";
const AppContent = () => {
  useSocketNotifications();

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          position: "top-center",
          style: {
            minWidth: "320px",
            maxWidth: "540px",
            padding: "14px 18px",
            fontSize: "15px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
            background: "#ffffff",
            color: "#111827",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <AppRoutes />
      {/* AI Chat Widget */}
      <ChatWidget />

    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;