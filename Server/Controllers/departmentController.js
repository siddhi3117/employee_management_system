import Department from "../Models/department.js";

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    // Match your frontend — uppercase D
    return res.status(200).json({ success: true, Departments: departments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get Department server error" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    const newDep = new Department({
      dep_name,
      description,
    });

    await newDep.save();
    return res.status(200).json({ success: true, Department: newDep });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "add department server error" });
  }
};


const getDepartment =async(req,res)=>{
  try{
    const {id} = req.params;
    const department=await department.findById({_id: id})
    return res.status(200).json({ success: true, Departments: department });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get Department server error" });
  }
  }
    const updateDepartment =async(req,res)

export { addDepartment, getDepartments,getDepartment };
