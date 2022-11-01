import axios from 'axios';

const url = 'http://localhost:3000/api';
type RequestProps<RequestData, ResponseData> = {
  path: string;
  data: RequestData;
  successCallback?: (arg: ResponseData) => void;
  failCalback?: (arg: string) => void;
};
const Request = {
  post<RequestData, ResponseData>({
    path,
    data,
    successCallback,
    failCalback,
  }: RequestProps<RequestData, ResponseData>) {
    axios
      .post(url + path, {
        ...data,
      })
      .then((res) => {
        successCallback?.(res.data);
      })
      .catch((err) => {
        failCalback?.(
          err?.response?.data?.error || 'Something went wrong, try again.'
        );
      });
  },
};
export default Request;
