import { useEffect, useState } from "react"
import {v4 as uuidv4} from "uuid"

const TodoList = () => {
  const [todoText, setTodoText] = useState("")
  const [todoList, setTodoList] = useState([])
  const [warning, setWarning] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  console.log(todoList)

  const saveTodoToStorage = (list) => {
    localStorage.setItem("todoList", JSON.stringify(list))
  }

  const deleteListFromStorage = (updatedList) => {
    saveTodoToStorage(updatedList)
  }

  const handleAddClick = (e) => {
    e.preventDefault()
    if(todoText.trim()){
      const newTodo = {id: uuidv4(), text: todoText, checked: false}
      const updatedList = [...todoList, newTodo]
      setTodoList(updatedList)
      saveTodoToStorage(updatedList)
      setTodoText("")
      setWarning(false)
    }else{
      setWarning(true)
    }
  }

  const handleCheckboxChange = (id) => {
    const updatedList = todoList.map(todo => 
      todo.id === id? {...todo, checked: !todo.checked}: todo
    )
    setTodoList(updatedList)
    saveTodoToStorage(updatedList)
  }

  const handleEdit = (id) => {
    const updatedList = todoList.map(todo => 
      todo.id === id? {...todo, isEditing: true}: todo
    )
    setTodoList(updatedList)
  }

  const handleSaveEdit = (id, newText) => {
    const updatedList = todoList.map(todo => 
      todo.id === id? {...todo, text: newText, isEditing: false}: todo
    )
    setTodoList(updatedList)
    saveTodoToStorage(updatedList)
  }

  const handleDelete = (id) => {
    const updatedList = todoList.filter(list => list.id !== id)
    setTodoList(updatedList)
    deleteListFromStorage(updatedList)
  }

  const handleKeyDown = (e, id) => {
    if(e.key === 'Enter'){
      handleSaveEdit(id, e.target.value)
    }
    // e.key === 'Enter' && handleSaveEdit(id, newText)
  }

  const handleChange = (e, id) => {
    const updatedList = todoList.map(todo =>
      todo.id === id? {...todo, text: e.target.value}: todo
    )
    setTodoList(updatedList)
  }

  useEffect(()=>{
    const handleClickOutside = (e) => {
      if(editingId !== null){
        const target = e.target
        if(target.closest(".edit-input") === null && !target.closest(".edit-button")){
          const editingTodo = todoList.find(todo => todo.id === editingId)
          if(editingTodo){
            handleSaveEdit(editingId, editingTodo.text)
          }
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return() => {
      document.removeEventListener("mouseDown", handleClickOutside)
    }
  },[editingId, todoList])
  
  return (
    <div className="max-w-screen-xl bg-zinc-400 mx-auto">
      <h1 className="text-4xl text-black p-4 text-center">Todo</h1>
      <div className="p-4">
        <form className="flex mb-2 ">
          <input 
            type="text" 
            className="w-full text-black text-lg px-2 py-1"
            onChange={e => setTodoText(e.target.value)}
            value={todoText}
            />
          <button 
            className="px-5 py-2 bg-black text-white"
            onClick={handleAddClick}
            >Add</button>
        </form>
        <div className="flex justify-between">
            <p className="text-red-500 text-sm">{warning? "This field cannot be left empty": ""}</p>
          <div className="flex">
            <button className="p-2 bg-black text-white">Sort</button>
            <button className="p-2 ml-2 bg-black text-white">Delete All</button>
          </div>
        </div>
      </div>
      <ul className="bg-red-200 ">
        {todoList.map(todo => (
          <li key={todo.id}
              className="flex items-center p-2"
          >
            <input 
              type="checkbox" 
              checked={todo.checked}
              onChange={() => handleCheckboxChange(todo.id)}
            />
            {todo.isEditing?(
              <input 
              type="text"
              value={todo.text}
              className="ml-2 edit-input"
              onChange={(e)=> handleChange(e, todo.id)}
              onKeyDown={(e) => handleKeyDown(e, todo.id)}
              onBlur={(e) => handleSaveEdit(todo.id, e.target.value)}
              />
            ):
              <label className="ml-2">{todo.text}</label>
            }
            
            <div className="ml-auto flex"> 
              <button 
              className="ml-2 edit-button"
              onClick={()=> handleEdit(todo.id)}
              >Edit</button>
              <button 
              className="ml-2"
              onClick={() => handleDelete(todo.id)}
              >Delete</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default TodoList