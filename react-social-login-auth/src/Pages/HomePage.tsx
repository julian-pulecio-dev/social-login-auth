import { cognitoPool } from "../Config/CognitoPool";
import {cognitoUserPool} from "../Config/CognitoUserPool";


const COGNITO_DOMAIN = cognitoUserPool.Domain;
const CLIENT_ID = cognitoPool.ClientId;
const REDIRECT_URI = "http://localhost:5173/social-login-confirm-code";
const RESPONSE_TYPE = "code";
const PROVIDER = "";

const getLoginUrl = () => {
  return `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}${PROVIDER}`;
};

const HomePage = () => {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={handleLogin}>Login with Cognito</button>
    </div>
  );
};

export default HomePage;
