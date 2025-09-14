import Task from "../Models/task.js";
import Employee from "../Models/employee.js";
import User from "../Models/User.js";

// Admin Controllers

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, adminNotes } = req.body;
    const assignedBy = req.user._id;

    // Validate assigned employee exists
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy,
      priority,
      dueDate: new Date(dueDate),
      adminNotes
    });

    await task.save();
    
    // Populate employee details for response
    await task.populate('assignedTo', 'name email department');
    await task.populate('assignedBy', 'name email');

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all tasks (admin view)
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name email')
      .populate({
        path: 'assignedTo',
        populate: {
          path: 'department',
          select: 'dep_name'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("Get all tasks error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email department')
      .populate('assignedBy', 'name email')
      .populate({
        path: 'assignedTo',
        populate: {
          path: 'department',
          select: 'dep_name'
        }
      });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update task (admin)
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, adminNotes, status } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (adminNotes !== undefined) task.adminNotes = adminNotes;
    if (status) {
      task.status = status;
      if (status === "completed") {
        task.completedAt = new Date();
      }
    }

    await task.save();
    
    // Populate for response
    await task.populate('assignedTo', 'name email department');
    await task.populate('assignedBy', 'name email');

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Employee Controllers

// Get tasks assigned to current employee
export const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find employee using the user reference
    const employee = await Employee.findOne({ userRef: userId });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const { status, priority } = req.query;
    
    let filter = { assignedTo: employee._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1, priority: 1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update task status (employee)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, employeeNotes } = req.body;
    const userId = req.user._id;
    
    // Find employee using the user reference
    const employee = await Employee.findOne({ userRef: userId });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      assignedTo: employee._id 
    });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found or not assigned to you" });
    }

    // Update status and notes
    task.status = status;
    if (employeeNotes !== undefined) task.employeeNotes = employeeNotes;
    
    if (status === "completed") {
      task.completedAt = new Date();
    }

    await task.save();
    
    // Populate for response
    await task.populate('assignedBy', 'name email');

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get task statistics
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find employee using the user reference
    const employee = await Employee.findOne({ userRef: userId });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const totalTasks = await Task.countDocuments({ assignedTo: employee._id });
    const pendingTasks = await Task.countDocuments({ assignedTo: employee._id, status: "pending" });
    const inProgressTasks = await Task.countDocuments({ assignedTo: employee._id, status: "in_progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: employee._id, status: "completed" });
    const overdueTasks = await Task.countDocuments({ 
      assignedTo: employee._id, 
      dueDate: { $lt: new Date() },
      status: { $in: ["pending", "in_progress"] }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        overdue: overdueTasks
      }
    });
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
