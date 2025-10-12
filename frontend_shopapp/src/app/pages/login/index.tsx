import { URL } from '@/constants';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'stores';
import { selectIsLogin } from 'stores/authSlice';
import LoginPage from 'app/pages/login/loginPage';

function Login() {
  const isLogin = useAppSelector(selectIsLogin);
  if (isLogin) {
    return <Navigate to={URL.Home} replace />;
  }

  return <LoginPage />;
}

export default Login;
