import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { Course } from '../types';

interface CourseContextProps {
    courses: Course[];
    fetchCourses: () => Promise<void>;
    createCourse: (courseData: Course) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

const baseURL = 'http://localhost:5000/api';

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>([]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get<Course[]>(`${baseURL}/main/courses`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const createCourse = async (courseData: Course) => {
        try {
            const response = await axios.post<Course>(`${baseURL}/main/courses`, courseData);
            setCourses([...courses, response.data]);
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const deleteCourse = async (id: string) => {
        try {
            await axios.delete<void>(`${baseURL}/main/courses/${id}`);
            setCourses(courses.filter(course => course._id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <CourseContext.Provider value={{ courses, fetchCourses, createCourse, deleteCourse }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourseContext must be used within a CourseProvider');
    }
    return context;
};
