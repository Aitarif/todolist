
import { useEffect, useRef, useState } from "react";
import Todo from "./Todo";
import Moment from "moment";
import Service from "./Service";


const todos = [
  {
    name: "Beli buah di Supermarket",
    date: "2022/08/17",
  },
  {
    name: "Beli pakan ikan",
    date: "2022/08/17",
  },  
];

function Todolist() {
  let inputTodoRef = useRef("");
  let inputDateRef = useRef("");
  let [todoList, setTodoList] = useState([]);
  let [todoIndex, setTodoIndex] = useState(null);

  async function loadListData() {
    const response = await Service.list();
    const data = response.data.data; 
    setTodoList(() =>data)
  }
  useEffect(() => {
    loadListData();
  }, []);

  async function handleRadioOnChecked(e, index) {
    await Service.toggleDone(index);
    loadListData();
  }
  
  async function handleAddButton(e) {
    e.preventDefault();
    if (todoIndex != null) {
      await Service.update({
            name: inputTodoRef.current.value,
            name: inputDataRef.current.value,
      }, todoIndex)
        setTodoIndex(() => null);
    
    } else {
      // Add
    await Service.create({
      name: inputTodoRef.current.value,
      date: inputDateRef.current.value,
      isDone: false,
    });
    loadListData();
  }
}

  async function handleDeleteList(e, index){
    e.preventDefault();
    if(!confirm("Apakah anda YaQueen?")) return;
    await Service.delete(index);
    loadListData();
  }

  async function handleClearAll(e) {
    e.preventDefault();
    if (confirm("Are you sure?")) return;
    setTodoList((_todos) => {
      _todos.splice(index, 1);
      return [..._todos];
    });

    await Service.deleteAll();
    loadListData();
  }  

  function handleCancel(){
    setTodoIndex(()=>null);
    inputTodoRef.current.value = null;
    inputDateRef.current.value = null;
  }
  
  function handleEdit(e, index) {
    e.preventDefault();
    const selectedTodo = todoList.find((_todo) => _todo.id == index);
    const formatedDate = Moment(selectedTodo.date).format("Y-MM-DD");
    inputTodoRef.current.value = selectedTodo.name;
    inputDateRef.current.value = formatedDate;
    setTodoIndex(() => index);
  }
  
  return (
    <div className="w-1/2 m-auto space-y-5 pt-3">
        <h1>Training Todo List</h1>
        <div className="space-x-2 flex flex-row justify-between ">
            <input
            ref={inputTodoRef}
            type="txt"
            className="border-2 border-gray-300 p-1 text-xs w-full"
            placeholder="Masukan TODO"
            />
            <input
            ref={inputDateRef}
            type="date"
            className="border-2 border-gray-300 p-1 text-xs w-full"
            placeholder="Masukan Tanggal"
            />
            <button onClick={handleAddButton} 
        className={
          (todoIndex == null ? "bg-cyan-300" : "bg-blue-300") +
        " w-[100px] text-white rounded-sm "}
        > {todoIndex == null ? "Add" :"Edit"} </button>
            
            <button
              onClick={handleCancel}
              className="bg-red-300 w-[100px] text-white rounded-sm"
            >
                Cancel
            </button>
        </div>
        

        <div className="space-y-1">
            {todoList.map((todo, key) => (
            <Todo
            index={todo.id} 
            date={todo.date} 
            name={todo.name}
            isDone={todo.isDone} 
            onChange={handleRadioOnChecked} 
            onDelete={handleDeleteList}
            onEdit={handleEdit}
            key={key} />
            ))}     
          
   
        </div>

        <div className="flex flex-row justify-between">   
        <p>
            You have {todoList.reduce((total, todo) => {
              if(todo.isDone) return total;
              return (total += 1 );
            }, 0 )} pending task </p>
                <button onClick={handleClearAll} className="bg-red-500 text-white p- rounded-md">clear all</button>
            </div>
    </div>
    );

}

export default Todolist