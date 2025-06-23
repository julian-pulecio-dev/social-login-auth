import axios, { AxiosResponse } from "axios";
import { AuthGoogleTokens } from "../../Types/AuthGoogleTokens";

const api = "https://nin85f3mgc.execute-api.us-east-1.amazonaws.com/dev/";

export const callbackSocialLogin = async (code:string, provider:string) => {
  console.log(code)
    const response: AxiosResponse<AuthGoogleTokens> = await axios.post(api + "social_auth_callback", {
      code,
      provider
    });
    console.log('callbackSocialLogin');
    console.log(response.data);
    console.log(response.status)
    return response;
    
  };