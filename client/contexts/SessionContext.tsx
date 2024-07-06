import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Session, Report, SessionC, User } from '../types';
import { saveAs } from 'file-saver';

interface SessionContextProps {
    sessions: Session[];
    reports: Report[];
    getSessions: () => void;
    getReports: () => void;
    getSessionById: (id: string) => Promise<Session | null>;
    createSession: (sessionData: Partial<SessionC>) => Promise<void>;
    updateSession: (id: string, sessionData: Partial<SessionC>) => Promise<void>;
    deleteSession: (id: string) => Promise<void>;
    markAttendance: (sessionId: string, studentId: string, status: string) => Promise<void>;
    generateAttendanceReport: (reportData: any, user: User | undefined | null) => Promise<Report>;
    exportReport: (reportId: string, exportType: 'pdf' | 'excel') => Promise<void>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

const baseURL = 'http://localhost:5000/api';

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [reports, setReports] = useState<Report[]>([]);

    const getSessions = async () => {
        try {
            const response = await axios.get<Session[]>(`${baseURL}/main/sessions`);
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const getSessionById = async (id: string): Promise<Session | null> => {
        try {
            const response = await axios.get<Session>(`${baseURL}/main/sessions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching session by ID:', error);
            return null;
        }
    };

    const createSession = async (sessionData: Partial<SessionC>) => {
        try {
            const response = await axios.post<Session>(`${baseURL}/main/sessions`, sessionData);
            setSessions([...sessions, response.data]);
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const updateSession = async (id: string, sessionData: Partial<SessionC>) => {
        try {
            const response = await axios.put<Session>(`${baseURL}/main/sessions/${id}`, sessionData);
            setSessions(sessions.map(session => (session._id === id ? response.data : session)));
        } catch (error) {
            console.error('Error updating session:', error);
        }
    };

    const deleteSession = async (id: string) => {
        try {
            await axios.delete<void>(`${baseURL}/main/sessions/${id}`);
            setSessions(sessions.filter(session => session._id !== id));
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const markAttendance = async (sessionId: string, studentId: string, status: string) => {
        try {
            await axios.post(`${baseURL}/main/sessions/mark-attendance`, { sessionId, studentId, status });
            getSessions(); // Refresh sessions
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    const generateAttendanceReport = async (reportData: any, user: User | undefined | null): Promise<Report> => {
        try {
            const response = await axios.post<Report>(`${baseURL}/main/sessions/report/${user?._id}`, reportData);
            setReports([...reports, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error generating attendance report:', error);
            throw error;
        }
    };

    const getReports = async () => {
        try {
            const response = await axios.get<Report[]>(`${baseURL}/main/reports`);
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const exportReport = async (reportId: string, exportType: 'pdf' | 'excel') => {
        try {
            const response = await axios.post(`${baseURL}/main/reports/${reportId}`, { reportId, exportType }, {
                responseType: 'blob' // Ensure the response type is blob for file download
            });

            // Determine the correct file extension
            const fileExtension = exportType === 'pdf' ? 'pdf' : 'xlsx';
            const filename = `report_${reportId}.${fileExtension}`;

            // Use the file-saver library to trigger the download
            saveAs(new Blob([response.data]), filename);
        } catch (error) {
            console.error('Error exporting report:', error);
        }
    };

    useEffect(() => {
        getSessions();
    }, []);

    return (
        <SessionContext.Provider value={{
            sessions,
            reports,
            getSessions,
            getSessionById,
            createSession,
            updateSession,
            deleteSession,
            markAttendance,
            generateAttendanceReport,
            getReports,
            exportReport
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextProps => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
