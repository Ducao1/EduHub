package com.project.web_be.services.Impl;

import com.project.web_be.entities.ExamActivity;
import com.project.web_be.repositories.ExamActivityRepository;
import com.project.web_be.services.ExamActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExamActivityServiceImpl implements ExamActivityService {
    private final ExamActivityRepository examActivityRepository;
    private final Map<String, Integer> activityCountMap = new HashMap<>();
    private static final int MAX_ACTIVITIES_PER_MINUTE = 5;
    private static final long ACTIVITY_WINDOW_MINUTES = 1;

    @Override
    public ExamActivity saveActivity(ExamActivity activity) {
        validateActivity(activity);
        checkActivityFrequency(activity);
        ExamActivity savedActivity = examActivityRepository.save(activity);
        processAdditionalLogic(savedActivity);
        return savedActivity;
    }

    private void validateActivity(ExamActivity activity) {
        if (activity == null || activity.getExamId() == null || activity.getClassId() == null ||
                activity.getStudentId() == null || activity.getActivityType() == null || activity.getTimestamp() == null) {
            throw new IllegalArgumentException("Dữ liệu hoạt động không hợp lệ: " + activity);
        }
    }

    private void checkActivityFrequency(ExamActivity activity) {
        String key = activity.getExamId() + "_" + activity.getClassId() + "_" + activity.getStudentId();
        LocalDateTime now = LocalDateTime.now();
        int currentCount = activityCountMap.getOrDefault(key, 0);
        activityCountMap.entrySet().removeIf(entry -> {
            long diff = Duration.between(activity.getTimestamp(), now).toMinutes();
            return diff > ACTIVITY_WINDOW_MINUTES;
        });
        if (currentCount >= MAX_ACTIVITIES_PER_MINUTE) {
            throw new IllegalStateException("Tần suất hoạt động quá cao cho sinh viên " + activity.getStudentId() +
                    " trong bài thi " + activity.getExamId());
        }
        activityCountMap.put(key, currentCount + 1);
    }

    private void processAdditionalLogic(ExamActivity activity) {
        if ("EXAM_SUBMITTED".equals(activity.getActivityType())) {
            System.out.println("Sinh viên " + activity.getStudentId() + " đã nộp bài thi " + activity.getExamId());
        } else if ("FULLSCREEN_EXIT".equals(activity.getActivityType()) || "TAB_CHANGE".equals(activity.getActivityType())) {
            System.out.println("Cảnh báo: Sinh viên " + activity.getStudentId() + " có hành vi đáng ngờ (" + activity.getActivityType() + ")");
        }
    }
}