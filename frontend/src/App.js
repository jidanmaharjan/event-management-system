import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Loggedin from "./components/Loggedin";

//pages imports
import Dashboard from "./pages/Dashboard/Dashboard";
import Forgotpassword from "./pages/Forgotpassword/Forgotpassword";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Resetpassword from "./pages/Resetpassword/Resetpassword";
import Static from "./Static";

function App() {
  axios.interceptors.request.use((request) => {
    const token =
      localStorage.getItem("accessT") ||
      sessionStorage.getItem("accessT") ||
      null;
    request.headers.Authorization = `Bearer ${token}`;
    return request;
  });
  return (
    <div className="App font-poppins w-full min-h-screen">
      <Routes>
        <Route path="/*" element={<Static />} />
        <Route path="/login" element={<Loggedin />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/signup" element={<Loggedin />}>
          <Route path="/signup" element={<Register />} />
        </Route>
        <Route path="/forgot_password" element={<Loggedin />}>
          <Route path="/forgot_password" element={<Forgotpassword />} />
        </Route>
        <Route path="/reset/:resetToken" element={<Loggedin />}>
          <Route path="/reset/:resetToken" element={<Resetpassword />} />
        </Route>

        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
