import HomePage from "../pages/home/home-page";
import AddPage from "../pages/add/add-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import DetailPage from "../pages/detail/detail-page";

const routes = {
  "/": new HomePage(),
  "/add": new AddPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/stories/:id": new DetailPage(),
};

export default routes;
