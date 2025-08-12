import { useNavigate } from "react-router-dom"

export const columns=[
    {
        name: "Sr No",
        selector:(row) => row.srno
    },

    {
        name: "Department Name",
        selector:(row) => row.dep_name
    }, 
     {
        name: "Action",
        selector:(row) => row.action
    },   
    
    
]

export const DepartmentButtons=({_id})=>{
    const navigate =useNavigate()
          
    return(
        <div className="flex space-x-3">
            <button className="px-3 py-2 bg-teal-600  text white"
               onClick={()=> navigate(`/admin-dashboard/department/${_id}`)}
            >Edit</button>
            <button  className="px-3 py-2 bg-red-600  text white">Delete</button>
        </div>
    )
}