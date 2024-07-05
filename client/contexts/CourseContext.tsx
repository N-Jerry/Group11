import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Course } from '../types';
import useAxios from '../hooks/useAxios';

interface CourseContextProps {
    courses: Course[];
    fetchCourses: () => Promise<void>;
    createCourse: (courseData: Course) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>([]);

    const fetchCourses = async () => {
        const { response, error, loading } = useAxios<Course[]>('main/courses', { method: 'GET' });
        if (loading) return;
        if (error) {
            console.error('Error fetching courses:', error);
            return;
        }
        setCourses(response?.data || []);
    };

    const createCourse = async (courseData: Course) => {
        const { response, error, loading } = useAxios<Course>('main/courses', {
            method: 'POST',
            data: courseData
        });
        if (loading) return;
        if (error) {
            console.error('Error creating course:', error);
            return;
        }
        if (response?.data) {
            setCourses([...courses, response.data]);
        }
    };

    const deleteCourse = async (id: string) => {
        const { response, error, loading } = useAxios<void>(`main/courses/${id}`, { method: 'DELETE' });
        if (loading) return;
        if (error) {
            console.error('Error deleting course:', error);
            return;
        }
        setCourses(courses.filter(course => course._id !== id));
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
