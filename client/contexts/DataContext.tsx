import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { Course, User, Session, Record, Report, Notification } from '../types/index';

interface DataContextProps {
  
  users: User[];
  courses: Course[];
  sessions: Session[];
  records: Record[];
  reports: Report[];
  notifications: Notification[];
  
  usersLoading: boolean;
  coursesLoading: boolean;
  sessionsLoading: boolean;
  recordsLoading: boolean;
  reportsLoading: boolean;
  notificationsLoading: boolean;
  
  fetchUsers: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchRecords: () => Promise<void>;
  fetchReports: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  
  createCourse: (course: Course) => Promise<void>;
  createSession: (session: Session) => Promise<void>;
  createRecord: (record: Record) => Promise<void>;
  createReport: (report: Report) => Promise<void>;
  createNotification: (notification: Notification) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

const defaultUsers: User[] = [
  {
    userId: 'user2',
    name: 'John Doe',
    email: 'student@example.com',
    password: '00000',
    userType: 'student',
    studentId: 'student1',
    courseIds: ["course2"]
  },
  {
    userId: 'user2',
    name: 'John Doe',
    email: 'student@example.com',
    password: '00000',
    userType: 'student',
    studentId: 'student1',
    courseIds: ["course1"]
  },
  {
    userId: 'user1',
    name: 'Jane Doe',
    email: 'instructor@example.com',
    password: '00000',
    userType: 'instructor',
    instructorId: 'instructor1',
    courseIds: ["course1", "course2"]
  }
];

const defaultCourses: Course[] = [
  {
    courseId: 'course1',
    name: 'Default Course',
    level: 200,
    instructorId: 'instructor1',
    schedule: [new Date()]
  },
  {
    courseId: 'course2',
    name: 'Alt Course',
    level: 100,
    instructorId: 'instructor1',
    schedule: [new Date()]
  }
];

const defaultSessions: Session[] = [
  {
    sessionId: 'session1',
    courseId: 'course2',
    instructorId: 'instructor1',
    location: 'Default Location',
    startTime: new Date(),
    endTime: new Date(),
    studentsPresent: 0,
    studentsAbsent: 0
  },
  {
    sessionId: 'session2',
    courseId: 'course2',
    instructorId: 'instructor1',
    location: 'Default Location',
    startTime: new Date(),
    endTime: new Date(),
    studentsPresent: 0,
    studentsAbsent: 0
  },
  {
    sessionId: 'session3',
    courseId: 'course1',
    instructorId: 'instructor1',
    location: 'Default Location',
    startTime: new Date(),
    endTime: new Date(),
    studentsPresent: 0,
    studentsAbsent: 0
  },
  {
    sessionId: 'session4',
    courseId: 'course2',
    instructorId: 'instructor1',
    location: 'Default Location',
    startTime: new Date(),
    endTime: new Date(),
    studentsPresent: 0,
    studentsAbsent: 0
  },
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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(false);
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(false);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(false);
  const [reportsLoading, setReportsLoading] = useState<boolean>(false);
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(false);

  const fetchData = async <T,>(
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    defaultData: T[]
  ) => {
    setLoading(true);
    try {
      const response = await useAxios<T[]>(endpoint, {
        method: 'GET',
      });
      if (response.data) {
        setState(response.data);
      } else {
        setState(defaultData);
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      setState(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = () => fetchData<User>('/users', setUsers, setUsersLoading, defaultUsers);
  const fetchCourses = () => fetchData<Course>('/courses', setCourses, setCoursesLoading, defaultCourses);
  const fetchSessions = () => fetchData<Session>('/sessions', setSessions, setSessionsLoading, defaultSessions);
  const fetchRecords = () => fetchData<Record>('/records', setRecords, setRecordsLoading, defaultRecords);
  const fetchReports = () => fetchData<Report>('/reports', setReports, setReportsLoading, defaultReports);
  const fetchNotifications = () => fetchData<Notification>('/notifications', setNotifications, setNotificationsLoading, defaultNotifications);

  const createData = async <T,>(
    endpoint: string,
    data: T,
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    try {
      const response = await useAxios<T>(endpoint, {
        method: 'POST',
        data,
      });
      if (response.data && response.data !== null) {
        setState([response.data]);
      } else {
        console.error(`Received null data from ${endpoint}`);
      }
    } catch (error) {
      console.error(`Error creating data at ${endpoint}:`, error);
    }
  };

  const createCourse = (course: Course) => createData<Course>('/courses', course, setCourses);
  const createSession = (session: Session) => createData<Session>('/sessions', session, setSessions);
  const createRecord = (record: Record) => createData<Record>('/records', record, setRecords);
  const createReport = (report: Report) => createData<Report>('/reports', report, setReports);
  const createNotification = (notification: Notification) => createData<Notification>('/notifications', notification, setNotifications);

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchSessions();
    fetchRecords();
    fetchReports();
    fetchNotifications();
  }, []);

  return (
    <DataContext.Provider value={{
      users,
      courses,
      sessions,
      records,
      reports,
      notifications,
      usersLoading,
      coursesLoading,
      sessionsLoading,
      recordsLoading,
      reportsLoading,
      notificationsLoading,
      fetchUsers,
      fetchCourses,
      fetchSessions,
      fetchRecords,
      fetchReports,
      fetchNotifications,
      createSession,
      createCourse,
      createNotification,
      createRecord,
      createReport,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
