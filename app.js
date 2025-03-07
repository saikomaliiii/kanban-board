import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Card, TextField } from "@mui/material";

const stages = ["To Do", "In Progress", "Peer Review", "Done"];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const moveTask = (taskId, newStage) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, stage: newStage } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, { id: Date.now(), ...newTask, stage: "To Do" }]);
      setNewTask({ title: "", description: "" });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px" }}>
        <TextField
          label="Search Tasks"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          {stages.map((stage) => (
            <KanbanColumn key={stage} stage={stage} tasks={tasks} moveTask={moveTask} searchTerm={searchTerm} />
          ))}
        </div>
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          <TextField
            label="Task Title"
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            label="Task Description"
            variant="outlined"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={addTask}>Add Task</Button>
        </div>
      </div>
    </DndProvider>
  );
};

const KanbanColumn = ({ stage, tasks, moveTask, searchTerm }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.id, stage),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  return (
    <div ref={drop} style={{ flex: 1, padding: "10px", backgroundColor: isOver ? "lightgray" : "#f4f4f4" }}>
      <h3>{stage}</h3>
      {tasks.filter(task => task.stage === stage && task.title.toLowerCase().includes(searchTerm)).map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  return (
    <Card ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: "10px", marginBottom: "10px" }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </Card>
  );
};

export default KanbanBoard;
