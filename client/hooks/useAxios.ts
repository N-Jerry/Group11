import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface AxiosParams extends AxiosRequestConfig { }

function useAxios<T>(url: string, params: AxiosParams): { data: T | null, loading: boolean, error: AxiosError | null } {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios(url, params);
                setData(response.data);
            } catch (error) {
                setError(error as AxiosError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function to cancel axios request if component unmounts or changes before request completes
        return () => {
            // You might need to cancel the axios request here if needed
        };
    }, [url, params]);

    return { data, loading, error };
}

export default useAxios;