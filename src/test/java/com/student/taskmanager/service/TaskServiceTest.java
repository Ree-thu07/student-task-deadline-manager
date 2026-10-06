package com.student.taskmanager.service;

import com.student.taskmanager.entity.Task;
import com.student.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createTask_shouldSaveTask() {

        // Arrange
        Task task = new Task(
                "Test Task",
                "Testing task creation",
                "DBMS",
                LocalDate.of(2026, 10, 10),
                "High",
                "Pending"
        );

        when(taskRepository.save(task)).thenReturn(task);

        // Act
        Task result = taskService.createTask(task);

        // Assert
        assertEquals("Test Task", result.getTitle());
        assertEquals("Testing task creation", result.getDescription());
        assertEquals("DBMS", result.getSubject());
        assertEquals(LocalDate.of(2026, 10, 10), result.getDeadline());
        assertEquals("High", result.getPriority());
        assertEquals("Pending", result.getStatus());

        verify(taskRepository).save(task);
    }
    @Test
void getAllTasks_shouldReturnAllTasks() {

    // Arrange
    Task task1 = new Task(
            "DBMS Assignment",
            "Complete DBMS work",
            "DBMS",
            LocalDate.of(2026, 10, 5),
            "High",
            "Pending"
    );

    Task task2 = new Task(
            "OS Assignment",
            "Complete OS work",
            "Operating Systems",
            LocalDate.of(2026, 10, 8),
            "Medium",
            "In Progress"
    );

    when(taskRepository.findAll()).thenReturn(java.util.List.of(task1, task2));

    // Act
    java.util.List<Task> result = taskService.getAllTasks();

    // Assert
    assertEquals(2, result.size());
    assertEquals("DBMS Assignment", result.get(0).getTitle());
    assertEquals("OS Assignment", result.get(1).getTitle());

    verify(taskRepository).findAll();
}
@Test
void getTaskById_shouldReturnTask() {

    // Arrange
    Task task = new Task(
            "DBMS Assignment",
            "Complete DBMS work",
            "DBMS",
            LocalDate.of(2026, 10, 5),
            "High",
            "Pending"
    );

    when(taskRepository.findById(1L))
            .thenReturn(java.util.Optional.of(task));

    // Act
    java.util.Optional<Task> result = taskService.getTaskById(1L);

    // Assert
    assertEquals(true, result.isPresent());
    assertEquals("DBMS Assignment", result.get().getTitle());
    assertEquals("DBMS", result.get().getSubject());
    assertEquals("High", result.get().getPriority());

    verify(taskRepository).findById(1L);
}
@Test
void updateTask_shouldUpdateExistingTask() {

    // Arrange
    Task existingTask = new Task(
            "Old Task",
            "Old description",
            "DBMS",
            LocalDate.of(2026, 10, 5),
            "Low",
            "Pending"
    );

    Task updatedTask = new Task(
            "Updated Task",
            "Updated description",
            "DBMS",
            LocalDate.of(2026, 10, 10),
            "High",
            "Completed"
    );

    when(taskRepository.findById(1L))
            .thenReturn(java.util.Optional.of(existingTask));

    when(taskRepository.save(existingTask))
            .thenReturn(existingTask);

    // Act
    Task result = taskService.updateTask(1L, updatedTask);

    // Assert
    assertEquals("Updated Task", result.getTitle());
    assertEquals("Updated description", result.getDescription());
    assertEquals("DBMS", result.getSubject());
    assertEquals(LocalDate.of(2026, 10, 10), result.getDeadline());
    assertEquals("High", result.getPriority());
    assertEquals("Completed", result.getStatus());

    verify(taskRepository).findById(1L);
    verify(taskRepository).save(existingTask);
}
@Test
void deleteTask_shouldDeleteTask() {

    // Act
    taskService.deleteTask(1L);

    // Assert
    verify(taskRepository).deleteById(1L);
}
}