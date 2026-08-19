import { useQuery } from '@tanstack/react-query';
import { analysisServices } from '../../services/analysisServices';

export const useFetchStudentAnalytics = () => {
  return useQuery({
    queryKey: ['studentAnalytics'],
    queryFn: () => analysisServices.fetchStudentAnalytics(),
  });
};

export const useFetchTeacherAnalytics = () => {
  return useQuery({
    queryKey: ['teacherAnalytics'],
    queryFn: () => analysisServices.fetchTeacherAnalytics(),
  });
};
