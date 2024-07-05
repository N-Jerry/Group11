import React, { createContext, useContext, useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { Session, Report } from '../types';

interface SessionContextProps {
    sessions: Session[];
    reports: Report[];
    getSessions: () => void;
    getReports: () => void;
    getSessionById: (id: string) => Promise<Session | null>;
    createSession: (sessionData: Partial<Session>) => Promise<void>;
    updateSession: (id: string, sessionData: Partial<Session>) => Promise<void>;
    deleteSession: (id: string) => Promise<void>;
    markAttendance: (sessionId: string, studentId: string) => Promise<void>;
    generateAttendanceReport: (reportData: any) => Promise<void>;
    exportReport: (reportId: string, exportType: 'pdf' | 'excel') => Promise<void>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [reports, setReports] = useState<Report[]>([]);

    const getSessions = async () => {
        const { response, error } = useAxios<Session[]>('main/sessions', { method: 'GET' });
        if (response) {
            setSessions(response.data || []);
        } else {
            console.error('Error fetching sessions:', error);
        }
    };

    const getSessionById = async (id: string): Promise<Session | null> => {
        const { response, error } = useAxios<Session>(`main/sessions/${id}`, { method: 'GET' });
        if (response) {
            return response.data;
        } else {
            console.error('Error fetching session by ID:', error);
            return null;
        }
    };

    const createSession = async (sessionData: Partial<Session>) => {
        const { response, error } = useAxios<Session>('main/sessions', {
            method: 'POST',
            data: sessionData,
        });
        if (response) {
            setSessions([...sessions, response.data]);
        } else {
            console.error('Error creating session:', error);
        }
    };

    const updateSession = async (id: string, sessionData: Partial<Session>) => {
        const { response, error } = useAxios<Session>(`main/sessions/${id}`, {
            method: 'PUT',
            data: sessionData,
        });
        if (response) {
            setSessions(sessions.map(session => (session._id === id ? response.data : session)));
        } else {
            console.error('Error updating session:', error);
        }
    };

    const deleteSession = async (id: string) => {
        const { error } = useAxios(`main/sessions/${id}`, { method: 'DELETE' });
        if (!error) {
            setSessions(sessions.filter(session => session._id !== id));
        } else {
            console.error('Error deleting session:', error);
        }
    };

    const markAttendance = async (sessionId: string, studentId: string) => {
        const { error } = useAxios(`main/sessions/mark-attendance`, {
            method: 'POST',
            data: { sessionId, studentId },
        });
        if (!error) {
            getSessions(); // Refresh sessions
        } else {
            console.error('Error marking attendance:', error);
        }
    };

    const generateAttendanceReport = async (reportData: any) => {
        const { response, error } = useAxios<Report>('main/sessions/report', {
            method: 'POST',
            data: reportData,
        });
        if (response) {
            setReports([...reports, response.data]);
        } else {
            console.error('Error generating attendance report:', error);
        }
    };

    const getReports = async () => {
        const { response, error } = useAxios<Report[]>('main/reports', { method: 'GET' });
        if (response) {
            setReports(response.data);
        } else {
            console.error('Error fetching reports:', error);
        }
    };

    const exportReport = async (reportId: string, exportType: 'pdf' | 'excel') => {
        const { error } = useAxios(`main/reports/${reportId}`, {
            method: 'POST',
            data: { exportType },
        });
        if (error) {
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
