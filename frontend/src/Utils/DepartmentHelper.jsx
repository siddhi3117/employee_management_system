import { useNavigate } from "react-router-dom"

export const columns = [
  {
    name: "Sr No",
    selector: (row,index) =>index+1,
    sortable:true,
  },
  {
      name: "Department Name",
    selector: (row) => row.dep_name || row.name, // match your backend field
    sortable: true,
  },
  {
   name: "Action",
    cell: (row) => <DepartmentButtons _id={row._id} />,
  },
]

export const DepartmentButtons = ({ _id }) => {
  const navigate = useNavigate()
 const handleDelete =()=>{
  
 }
  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>
      <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        onClick={() => navigate(`/admin-dashboard/department/delete/${_id}`)}>
        Delete
      </button>
    </div>
  )
}
