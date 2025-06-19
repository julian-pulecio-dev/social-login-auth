import axios, { AxiosResponse } from "axios";
import { AuthGoogleTokens } from "../../Types/AuthGoogleTokens";

const api = "https://7nwi2gdpjd.execute-api.us-east-1.amazonaws.com/dev/";

export const callProtectedRouteApi = async () => {
    const response: AxiosResponse = await axios.post(api + "protected");
    return response;
};