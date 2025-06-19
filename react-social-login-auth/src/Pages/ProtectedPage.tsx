import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/useAuth";


const ProtectedPage = () => {
  const { callProtectedRoute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        let res = await callProtectedRoute();
        console.log(res)
      } catch (err) {
        console.error('Authentication failed:', err);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div>
      <h2>very secret page</h2>
    </div>
  );
};

export default ProtectedPage;
