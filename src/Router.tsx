import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login/login";
import UsersDashboard from "./views/Dashboard/dashboard";
import MainLayout from "./views/Loader/mainLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <UsersDashboard />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
