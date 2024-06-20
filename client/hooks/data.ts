import { useEffect } from 'react';
import useAxios from './useAxios';
import { Course, Session, Record, Report, Notification } from '../types/index';

const BASE_URL = 'http://example.com/api'; // Replace this with your actual backend API base URL

const defaultCourses: Course[] = [
    {
        courseId: 'course1',
        name: 'Default Course',
        instructorId: 'instructor1',
        schedule: [new Date()]
    },
    {
        courseId: 'course2',
        name: 'Alt Course',
        instructorId: 'instructor1',
        schedule: [new Date()]
    }
];

const defaultSessions: Session[] = [
    {
        sessionId: 'session1',
        courseId: 'course1',
        instructorId: 'instructor1',
        location: 'Default Location',
        timestamp: new Date(),
        deadline: new Date(),
        studentsPresent: 0,
        studentsAbsent: 0
    },
    {
        sessionId: 'session2',
        courseId: 'course2',
        instructorId: 'instructor1',
        location: 'Default Location',
        timestamp: new Date(),
        deadline: new Date(),
        studentsPresent: 0,
        studentsAbsent: 0
    }
];

const defaultRecords: Record[] = [
    {
        recordId: 'record1',
        studentId: 'student1',
        sessionId: 'session1',
        status: 'pending'
    },
    {
        recordId: 'record2',
        studentId: 'student1',
        sessionId: 'session2',
        status: 'pending'
    }
];

const defaultReports: Report[] = [
    {
        reportId: 'report1',
        userId: 'user1',
        type: 'Default Type',
        generatedOn: new Date()
    }
];

const defaultNotifications: Notification[] = [
    {
        notificationId: 'notification1',
        userId: 'user1',
        message: 'Default Message',
        type: 'Default Type',
        timestamp: new Date()
    }
];

export const useFetchData = () => {
    const { data: coursesData, loading: coursesLoading, error: coursesError } = useAxios<Course[]>(`${BASE_URL}/courses`, { method: 'GET' });
    const { data: sessionsData, loading: sessionsLoading, error: sessionsError } = useAxios<Session[]>(`${BASE_URL}/sessions`, { method: 'GET' });
    const { data: recordsData, loading: recordsLoading, error: recordsError } = useAxios<Record[]>(`${BASE_URL}/records`, { method: 'GET' });
    const { data: reportsData, loading: reportsLoading, error: reportsError } = useAxios<Report[]>(`${BASE_URL}/reports`, { method: 'GET' });
    const { data: notificationsData, loading: notificationsLoading, error: notificationsError } = useAxios<Notification[]>(`${BASE_URL}/notifications`, { method: 'GET' });

    useEffect(() => {
        if (coursesError) {
            console.error('Error fetching courses:', coursesError);
        }
        if (sessionsError) {
            console.error('Error fetching sessions:', sessionsError);
        }
        if (recordsError) {
            console.error('Error fetching records:', recordsError);
        }
        if (reportsError) {
            console.error('Error fetching reports:', reportsError);
        }
        if (notificationsError) {
            console.error('Error fetching notifications:', notificationsError);
        }
    }, [coursesError, sessionsError, recordsError, reportsError, notificationsError]);

    return {
        courses: coursesError ? defaultCourses : (coursesData || []),
        sessions: sessionsError ? defaultSessions : (sessionsData || []),
        records: recordsError ? defaultRecords : (recordsData || []),
        reports: reportsError ? defaultReports : (reportsData || []),
        notifications: notificationsError ? defaultNotifications : (notificationsData || []),
        loading: coursesLoading || sessionsLoading || recordsLoading || reportsLoading || notificationsLoading
    };
};
