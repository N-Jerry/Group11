import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Course } from '../types/index';
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
        try {
            const response = await useAxios<Course[]>('main/courses', {
                method: 'GET'
            });
            setCourses(response.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const createCourse = async (courseData: Course) => {
        try {
            const response = await useAxios<Course>('main/courses', {
                method: 'POST',
                data: courseData
            });
            if (response.data) {
                setCourses([...courses, response.data]);
            }
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const deleteCourse = async (id: string) => {
        try {
            await useAxios(`main/courses/${id}`, {
                method: 'DELETE'
            });
            setCourses(courses.filter(course => course._id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // Fetch courses on initial load
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
    if (context === undefined) {
        throw new Error('useCourseContext must be used within a CourseProvider');
    }
    return context;
};
