import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { Feedback } from '@/types';
import ip from "../ipAddress.json"

interface FeedbackContextProps {
    feedbacks: Feedback[];
    loading: boolean;
    error: string | null;
    submitFeedback: (FeedbackData: SubmitFeedbackParams) => Promise<void>;
    viewFeedback: (userID: string | undefined) => Promise<void>;
    getAllFeedbacks: () => Promise<void>;
    updateFeedbackStatus: (feedbackID: string, status: string) => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);

const baseURL = `http://${ip.ipAddress}:5000/api/main`; // Adjust as per your backend API base URL

interface SubmitFeedbackParams {
    userID: string | undefined;
    message: string;
    type: string;
}

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const submitFeedback = async ({userID, message, type}: SubmitFeedbackParams) => {
        setLoading(true);
        try {
            const response = await axios.post<Feedback>(`${baseURL}/feedback`, { userID, message, type });
            setFeedbacks(prevFeedbacks => [...prevFeedbacks, response.data]);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const viewFeedback = async (userID: string | undefined) => {
        setLoading(true);
        try {
            const response = await axios.get<Feedback[]>(`${baseURL}/feedbacks/${userID}`);
            setFeedbacks(response.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getAllFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Feedback[]>(`${baseURL}/feedbacks`);
            setFeedbacks(response.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateFeedbackStatus = async (feedbackID: string, status: string) => {
        setLoading(true);
        try {
            const response = await axios.put<Feedback>(`${baseURL}/feedbacks`, { feedbackID, status });
            setFeedbacks(prevFeedbacks =>
                prevFeedbacks.map(feedback =>
                    feedback._id === response.data._id ? { ...feedback, status: response.data.status } : feedback
                )
            );
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllFeedbacks();
    }, []);

    return (
        <FeedbackContext.Provider
            value={{ feedbacks, loading, error, submitFeedback, viewFeedback, getAllFeedbacks, updateFeedbackStatus }}
        >
            {children}
        </FeedbackContext.Provider>
    );
};

export const useFeedbackContext = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedbackContext must be used within a FeedbackProvider');
    }
    return context;
};
