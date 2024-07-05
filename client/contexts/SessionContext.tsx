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
        try {
            const response = await useAxios<Session[]>('main/sessions', { method: 'GET' });
            setSessions(response.data || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const getSessionById = async (id: string): Promise<Session | null> => {
        try {
            const response = await useAxios<Session>(`main/sessions/${id}`, { method: 'GET' });
            return response.data;
        } catch (error) {
            console.error('Error fetching session by ID:', error);
            return null;
        }
    };

    const createSession = async (sessionData: Partial<Session>) => {
        try {
            const response = await useAxios<Session>('main/sessions', {
                method: 'POST',
                data: sessionData,
            });
            if (response.data) {
                setSessions([...sessions, response.data]);
            }
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const updateSession = async (id: string, sessionData: Partial<Session>) => {
        try {
            const response = await useAxios<Session>(`main/sessions/${id}`, {
                method: 'PUT',
                data: sessionData,
            });

            if (response.data) {
                setSessions(sessions.map(session => (session._id === id ? response.data! : session)));
            } else {
                console.error('Error updating session: No data returned');
            }
        } catch (error) {
            console.error('Error updating session:', error);
        }
    };



    const deleteSession = async (id: string) => {
        try {
            await useAxios(`main/sessions/${id}`, { method: 'DELETE' });
            setSessions(sessions.filter(session => session._id !== id));
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const markAttendance = async (sessionId: string, studentId: string) => {
        try {
            await useAxios(`main/sessions/mark-attendance`, {
                method: 'POST',
                data: { sessionId, studentId },
            });
            getSessions(); // Refresh sessions
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    const generateAttendanceReport = async (reportData: any) => {
        try {
            const response = await useAxios<Report>('main/sessions/report', {
                method: 'POST',
                data: reportData,
            });
            setReports([...reports, response.data!]);
        } catch (error) {
            console.error('Error generating attendance report:', error);
        }
    };

    const getReports = async () => {
        try {
            const response = await useAxios<Report[]>('main/reports', { method: 'GET' });
            setReports(response.data!);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const exportReport = async (reportId: string, exportType: 'pdf' | 'excel') => {
        try {
            await useAxios(`main/reports/${reportId}`, {
                method: 'POST',
                data: { exportType },
            });
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
