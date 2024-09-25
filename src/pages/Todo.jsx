import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PiDotsThreeCircleVertical } from "react-icons/pi";
// import { FaRegTrashCan } from "react-icons/fa6";
// import { FaRegEdit } from "react-icons/fa";


const Todo = () => {
  const [inputText, setInputText] = useState("")
  const [todoList, setTodoList] = useState([])
  const [showWarning, setShowWarning] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState(null)

  console.log('todoList:', todoList)

  useEffect(() => {
    handleGetStorage()
  },[])

  const handleGetStorage = () => {
    const data = JSON.parse(localStorage.getItem('todo-list'))
    if(data){
      setTodoList(data)
    }
  }
  const handleSetStorage = (list) => {
    localStorage.setItem('todo-list', JSON.stringify(list))
  }
  const handleDeleteAllFromStorage = () => {
    localStorage.removeItem('todo-list')
  }
  const handleAdd = () => {
    if(inputText.trim()){
      const newTodo = {id: uuidv4(), isChecked: false, text: inputText}
      const updatedList = [...todoList, newTodo]
      setTodoList(updatedList)
      handleSetStorage(updatedList)
      setInputText("")
      setShowWarning(false)
    }else{
      setShowWarning(true)
    }
  }
  const handleAddClick = () => {
    handleAdd()
  }

  const handleKeydown = (e) => {
    if(e.key === 'Enter'){
      handleAdd()
    }
  }

  const handleSortClick = () => {
    const sortedList = [...todoList].reverse()
    setTodoList(sortedList)
    handleSetStorage(sortedList)
  }

  const handleDeleteAll = () => {
    setTodoList([])
    handleDeleteAllFromStorage()
  }

  const handleChecked = (id) => {
    const updatedList = todoList.map(item => {
      if(item.id === id){
        return {...item, isChecked: !item.isChecked}
      }
      return item
    })
    setTodoList(updatedList)
    handleSetStorage(updatedList)
  }

  const handleMenuBtn = (id) => {
    setMenuOpenId(menuOpenId === id? null : id)
    console.log(menuOpenId)

  }

  console.log(inputText)
  return (
    <div className="container max-w-screen-xl min-h-screen mx-auto p-2 bg-pink-200">
      <h1 className="text-center p-4 text-xl">Todo List</h1>
      <div className="flex justify-center gap-2 mb-2">
        <input 
          type="text" 
          className="p-2 text-lg w-4/5 rounded-sm" 
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          onKeyDown={handleKeydown}
          />
        <button 
          className="bg-white p-2 w-32 rounded-sm"
          onClick={handleAddClick}
        >Add</button>
      </div>
      <div className='flex items-center'>
        <p className="text-red-400 mr-auto">{showWarning&& "Please type your list"}</p>
        <button 
          className="p-2 bg-white rounded-sm mr-2"
          onClick={handleSortClick}
        >Sort</button>
        <button 
          className="p-2 bg-white rounded-sm"
          onClick={handleDeleteAll}
          >Delete All</button>
      </div>

      <ul className="">
        {todoList?.map(item => (
          <li key={item.id}
              className='flex items-center mt-1 relative'>
            <input 
              type="checkbox"
              checked={item.isChecked}
              onChange={()=>handleChecked(item.id)}
              className='mr-2 size-4' />
            <label className={`mr-auto ${item.isChecked? 'line-through': ''}`}>{item.text}</label>

            <button 
              className=' p-1 bg-blue-200'
              onClick={() => handleMenuBtn(item.id)}
            >
              <PiDotsThreeCircleVertical className='size-6'/>
            </button>
            {menuOpenId === item.id && (
            <div className='absolute right-7 bottom-0 p-1 bg-orange-600' >
              <button className='hover:bg-white hover:text-lime-500 px-2 mr-2'>Edit</button>
              <button className='hover:bg-white hover:text-rose-600 px-2' >Delete</button>
            </div>

            )}

          </li>
        ))
      }
      

      </ul>
    </div>
    
  )
}

export default Todo