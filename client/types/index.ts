
export interface User {
    _id: string;
    name: string;
    email: string;
    tel: string;
    password: string;
    userType: string;
    studentId?: string;
    instructorId?: string;
    courseCodes?: string[];
    biometrics?: string | null | undefined;
    department?: string;
}

export interface Schedule {
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string;
    endTime: string;
}

export interface Course {
    _id: string;
    title: string;
    code: string;
    level?: number;
    schedule: Schedule[];
}

export interface Record {
    status: 'present' | 'absent';
    student: Partial<User>;
}

export interface Session {
    _id?: string;
    date: Date;
    deadline: Date;
    location: string;
    course: Partial<Course>;
    records: Record[];
}

export interface SessionC {
    date?: Date;
    deadline?: Date;
    location?: string;
    course: string;
}

export interface Parameter<K extends string = string, T = any> {
    [key: string]: T;
}

export interface Report {
    _id: string;
    generatedBy: Partial<User>;
    reportType: 'pdf' | 'excell';
    generatedDate?: Date;
    parameters: Parameter<string, string>[];
    data: any;
}

export interface ReportR {
    _id: string;
    generatedBy: string;
    reportType: 'pdf' | 'excell';
    generatedDate?: Date;
    parameters: Parameter<string, string>[];
    data: any;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
}

export interface SecuritySettings {
    twoFactorAuth: 'enabled' | 'disabled';
    loginAlerts: 'enabled' | 'disabled';
}

export interface PrivacySettings {
    dataSharing: 'enabled' | 'disabled';
    activityStatus: 'visible' | 'hidden';
}

export interface PersonalSettings {
    notificationPreferences: NotificationPreferences;
    securitySettings: SecuritySettings;
    privacySettings: PrivacySettings;
}

export interface Feedback {
    _id?: string;
    user: string;
    message: string;
    type: string;
    status: string;
    timestamp: Date;
}