import axios, { AxiosResponse } from "axios";

const api = "https://nin85f3mgc.execute-api.us-east-1.amazonaws.com/dev/";

export const callProtectedRouteApi = async () => {
    const response: AxiosResponse = await axios.post(api + "protected");
    return response;
};