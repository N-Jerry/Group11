import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const baseURL = 'http://localhost:5000/api'

const useAxios = <T>(url: string, config: AxiosRequestConfig): { 
  response: AxiosResponse<T> | null; 
  error: AxiosError | null; 
  loading: boolean;
} => {
  const [response, setResponse] = useState<AxiosResponse<T> | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const res = await axios({
          ...config,
          url: baseURL + url,
          cancelToken: source.token,
        });
        setResponse(res);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', (err as AxiosError).message);
        } else {
          setError(err as AxiosError);
          setResponse(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [url, config]);

  return { response, error, loading };
};

export default useAxios;
