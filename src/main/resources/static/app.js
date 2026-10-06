const API_URL = "http://localhost:8090/api/tasks";

let editingTaskId = null;


// ===============================
// Load Tasks When Page Opens
// ===============================

document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("searchInput").addEventListener("input", loadTasks);


// ===============================
// Add / Update Task
// ===============================

document
    .getElementById("taskForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const task = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            subject: document.getElementById("subject").value,
            deadline: document.getElementById("deadline").value,
            priority: document.getElementById("priority").value,
            status: document.getElementById("status").value
        };

        try {

            let response;

            // UPDATE existing task
            if (editingTaskId !== null) {

                response = await fetch(
                    `${API_URL}/${editingTaskId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(task)
                    }
                );

            }

            // ADD new task
            else {

                response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(task)
                });

            }


            if (!response.ok) {
                throw new Error("Request failed");
            }


            if (editingTaskId !== null) {
                alert("Task updated successfully!");
            } else {
                alert("Task added successfully!");
            }


            // Reset form
            document.getElementById("taskForm").reset();

            editingTaskId = null;

            document.querySelector("#taskForm button").textContent =
                "Add Task";


            // Reload tasks
            loadTasks();


        } catch (error) {

            console.error(error);
            alert("Error saving task.");

        }

    });


// ===============================
// Get All Tasks
// ===============================

async function loadTasks() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();

const searchText = document.getElementById("searchInput").value.toLowerCase();

const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchText) ||
    task.subject.toLowerCase().includes(searchText) ||
    task.priority.toLowerCase().includes(searchText) ||
    task.status.toLowerCase().includes(searchText)
);

displayTasks(filteredTasks);
updateDashboard(tasks);

    } catch (error) {

        console.error(error);
        alert("Could not connect to the backend.");

    }

}


// ===============================
// Display Tasks
// ===============================

function displayTasks(tasks) {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";


    if (tasks.length === 0) {

        taskList.innerHTML = "<p>No tasks available.</p>";

        return;
    }


    tasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        taskCard.innerHTML = `
            <h3>${task.title}</h3>

            <p>
                <strong>Description:</strong>
                ${task.description || "No description"}
            </p>

            <p>
                <strong>Subject:</strong>
                ${task.subject}
            </p>

            <p>
                <strong>Deadline:</strong>
                ${task.deadline}
            </p>

            <p>
                <strong>Priority:</strong>
                ${task.priority}
            </p>

            <p>
                <strong>Status:</strong>
                ${task.status}
            </p>

            <button onclick="editTask(${task.id})">
                Edit
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;


        taskList.appendChild(taskCard);

    });

}


// ===============================
// Edit Task
// ===============================

async function editTask(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Failed to get task");
        }

        const task = await response.json();


        // Fill form with existing data

        document.getElementById("title").value =
            task.title;

        document.getElementById("description").value =
            task.description || "";

        document.getElementById("subject").value =
            task.subject;

        document.getElementById("deadline").value =
            task.deadline;

        document.getElementById("priority").value =
            task.priority;

        document.getElementById("status").value =
            task.status;


        // Remember which task we're editing

        editingTaskId = id;


        // Change button text

        document.querySelector("#taskForm button").textContent =
            "Update Task";


        // Scroll to form

        document
            .querySelector(".task-form-section")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(error);
        alert("Could not load task.");

    }

}


// ===============================
// Delete Task
// ===============================

async function deleteTask(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to delete task");
        }


        alert("Task deleted successfully!");

        loadTasks();


    } catch (error) {

        console.error(error);
        alert("Error deleting task.");

    }

}


// ===============================
// Update Dashboard
// ===============================

function updateDashboard(tasks) {

    const totalTasks = tasks.length;


    const pendingTasks = tasks.filter(
        task => task.status === "Pending"
    ).length;


    const progressTasks = tasks.filter(
        task => task.status === "In Progress"
    ).length;


    const completedTasks = tasks.filter(
        task => task.status === "Completed"
    ).length;


    document.getElementById("totalTasks").textContent =
        totalTasks;

    document.getElementById("pendingTasks").textContent =
        pendingTasks;

    document.getElementById("progressTasks").textContent =
        progressTasks;

    document.getElementById("completedTasks").textContent =
        completedTasks;
}