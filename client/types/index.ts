
export interface User {
    userId: string;
    name: string;
    email: string;
    password: string;
    userType: string;
    studentId?: string;
    instructorId?: string;
    courseIds?: string[];
    fingerPrintData?: string;
}

export interface Course {
    courseId: string;
    name: string;
    level: number;
    instructorId: string[];
    schedule: Date[];
}

export interface Session {
    sessionId: string;
    courseId: string;
    instructorId: string;
    location: string;
    startTime: Date;
    endTime: Date;
    studentsPresent: number;
    studentsAbsent: number;
}

export interface Record {
    recordId: string;
    studentId: string;
    sessionId: string;
    status: 'pending' | 'verified' | 'failed' | 'late' | 'present';
}

export interface Report {
    reportId: string;
    userId: string;
    type: string;
    generatedOn: Date;
}

export interface Notification {
    notificationId: string;
    userId: string;
    message: string;
    type: string;
    timestamp: Date;
}
