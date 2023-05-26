import React, { useState } from "react";
import "./Taskmanager.css";
import * as XLSX from "xlsx";

const Taskmanager = () => {
  const [task1, setTask1] = useState("");
  const [task2, setTask2] = useState("");
  const [task3, setTask3] = useState("");
  const [tasklist1, setTasklist1] = useState([]);
  const [tasklist2, setTasklist2] = useState([]);
  const [tasklist3, setTasklist3] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const addTask = (task, setTask, taskList, setTaskList) => {
    if (task.trim() !== "") {
      setTaskList([...taskList, task]);
      setTask("");
    }
  };

  const deleteTask = (index, taskList, setTaskList) => {
    const updatedList = [...taskList];
    updatedList.splice(index, 1);
    setTaskList(updatedList);
  };

  const moveTask = (
    index,
    sourceList,
    setSourceList,
    destinationList,
    setDestinationList
  ) => {
    const taskToMove = sourceList[index];
    const updatedSourceList = [...sourceList];
    updatedSourceList.splice(index, 1);
    const updatedDestinationList = [...destinationList, taskToMove];
    setSourceList(updatedSourceList);
    setDestinationList(updatedDestinationList);
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setEditedTask(task);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditedTask("");
  };

  const saveTask = (index, taskList, setTaskList) => {
    const updatedList = [...taskList];
    updatedList[index] = editedTask;
    setTaskList(updatedList);
    setEditingTask(null);
    setEditedTask("");
  };

  const exportToExcel = () => {
    // Combine all task lists into a single array
    const allTasks = [...tasklist1, ...tasklist2, ...tasklist3];

    // Prepare data for Excel export
    const data = allTasks.map((task) => ({ Task: task }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a worksheet and add data
    const worksheet = XLSX.utils.json_to_sheet(data, { header: ["Task"] });
    XLSX.utils.sheet_add_json(worksheet, data, {
      skipHeader: true,
      origin: "A2",
    });

    // Set column width to fit the content
    const columnWidth = data.reduce((acc, task) => {
      const taskLength = task.Task.length;
      return taskLength > acc ? taskLength : acc;
    }, 0);
    worksheet["!cols"] = [{ width: columnWidth + 2 }];

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task List");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "tasklist.xlsx");
  };

  return (
    <div className="task-manager">
      <h1>Task Management</h1>
      <div className="add-task">
        <div>
          <h3>Add task-1</h3>
          <input
            type="text"
            value={task1}
            onChange={(e) => setTask1(e.target.value)}
            placeholder="Enter the task to be added."
          />
          <button
            onClick={() => addTask(task1, setTask1, tasklist1, setTasklist1)}
          >
            ADD
          </button>
        </div>
        <div>
          <h3>Add task-2</h3>
          <input
            type="text"
            value={task2}
            onChange={(e) => setTask2(e.target.value)}
            placeholder="Enter the task to be added."
          />
          <button
            onClick={() => addTask(task2, setTask2, tasklist2, setTasklist2)}
          >
            ADD
          </button>
        </div>
        <div>
          <h3>Add task-3</h3>
          <input
            type="text"
            value={task3}
            onChange={(e) => setTask3(e.target.value)}
            placeholder="Enter the task to be added."
          />
          <button
            onClick={() => addTask(task3, setTask3, tasklist3, setTasklist3)}
          >
            ADD
          </button>
        </div>
      </div>
      <div className="task-list">
        <div>
          <h3>Task list 1</h3>
          {tasklist1.map((task, index) => (
            <div key={index} className="task-card">
              {editingTask === task ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  placeholder="Edit the task."
                />
              ) : (
                <p>{task}</p>
              )}
              <br />
              <button
                onClick={() => deleteTask(index, tasklist1, setTasklist1)}
              >
                Delete
              </button>
              {editingTask === task ? (
                <>
                  <button
                    onClick={() => saveTask(index, tasklist1, setTasklist1)}
                  >
                    Save
                  </button>

                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <button onClick={() => startEdit(task)}>Edit</button>
              )}
              <select
                onChange={(e) =>
                  moveTask(
                    index,
                    tasklist1,
                    setTasklist1,
                    e.target.value === "tasklist2" ? tasklist2 : tasklist3,
                    e.target.value === "tasklist2" ? setTasklist2 : setTasklist3
                  )
                }
              >
                <option value="">Move to:</option>
                <option value="tasklist2">Task list 2</option>
                <option value="tasklist3">Task list 3</option>
              </select>
            </div>
          ))}
        </div>
        <div>
          <h3>Task list 2</h3>
          {tasklist2.map((task, index) => (
            <div key={index} className="task-card">
              {editingTask === task ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  placeholder="Edit the task."
                />
              ) : (
                <p>{task}</p>
              )}
              <button
                onClick={() => deleteTask(index, tasklist2, setTasklist2)}
              >
                Delete
              </button>
              {editingTask === task ? (
                <>
                  <button
                    onClick={() => saveTask(index, tasklist2, setTasklist2)}
                  >
                    Save
                  </button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <button onClick={() => startEdit(task)}>Edit</button>
              )}
              <select
                onChange={(e) =>
                  moveTask(
                    index,
                    tasklist2,
                    setTasklist2,
                    e.target.value === "tasklist1" ? tasklist1 : tasklist3,
                    e.target.value === "tasklist1" ? setTasklist1 : setTasklist3
                  )
                }
              >
                <option value="">Move to:</option>
                <option value="tasklist1">Task list 1</option>
                <option value="tasklist3">Task list 3</option>
              </select>
            </div>
          ))}
        </div>
        <div>
          <h3>Task list 3</h3>
          {tasklist3.map((task, index) => (
            <div key={index} className="task-card">
              {editingTask === task ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                  placeholder="Edit the task."
                />
              ) : (
                <p>{task}</p>
              )}
              <button
                onClick={() => deleteTask(index, tasklist3, setTasklist3)}
              >
                Delete
              </button>
              {editingTask === task ? (
                <>
                  <button
                    onClick={() => saveTask(index, tasklist3, setTasklist3)}
                  >
                    Save
                  </button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <button onClick={() => startEdit(task)}>Edit</button>
              )}
              <select
                onChange={(e) =>
                  moveTask(
                    index,
                    tasklist3,
                    setTasklist3,
                    e.target.value === "tasklist1" ? tasklist1 : tasklist2,
                    e.target.value === "tasklist1" ? setTasklist1 : setTasklist2
                  )
                }
              >
                <option value="">Move to:</option>
                <option value="tasklist1">Task list 1</option>
                <option value="tasklist2">Task list 2</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
    </div>
  );
};

export default Taskmanager;
