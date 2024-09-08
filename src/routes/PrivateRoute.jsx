import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const auth = localStorage.getItem('sainta-auth-token');

  return <>{auth ? <Outlet /> : <Navigate to="/" />}</>;
}
