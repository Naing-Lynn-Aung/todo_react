import './App.css';
import{ useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Link, useLocation } from "react-router-dom";
const App = () => {

  const location = useLocation();
  const unique_id = uuid();
  const [ titleName, setValue ] = useState('');
  const [ todos, setTodos ] = useState(JSON.parse(localStorage.getItem('todos')) ||[]);
  const [filter, setFilter ] = useState(location.pathname)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    let val = titleName.trim();
    if(val){
      setTodos([...todos, { id: unique_id, title: titleName, completed: false, edit: false }]);
      setValue('');
    }
   }

   const handleComplete = (id) => {
    setTodos(
      todos.map(todo => {
        if(todo.id === id){
          return { ...todo, completed: !todo.completed }
        }
        return todo
      })
    )
   }

   const handleEdit = (id) => {
    setTodos(
      todos.map(todo => {
        if(todo.id === id){
          return { ...todo, edit: !todo.edit }
        }
        return todo
      })
    )
   }

   const removeInput = (e, id) => {
    setTodos(
      todos.map(todo => {
        if(todo.id === id){
          if(e.target.value.trim().length === 0){
            return { ...todo, edit: false }
          }
          return { ...todo, title: e.target.value, edit: false }
        }
        return todo
      })
    )
   }

   const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
   }
   const clearCompleted = () => {
    setTodos(todos.filter(todo => todo.completed !== true));
   }

   const remaining = todos.filter(todo => !todo.completed).length;

   const completed = todos.filter(todo => todo.completed).length

   const todosFilter = (filter) => {
      if(filter === '/'){
        return todos
      }else if(filter === '/active'){
        return todos.filter(todo => !todo.completed)
      }else if(filter === '/completed'){
        return todos.filter(todo => todo.completed)
      }else{
        return todos
      }
   }
    
  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className='col-4 m-auto'>
        <div>
          <input type="text" className='form-control' onKeyPress={ event => event.charCode === 13 && addTodo() } onChange={ (event) => { setValue(event.target.value) } } value={titleName} />
        </div>
        <ul className='mt-3 pt-3'>
          { todosFilter(filter).map((todo) => {
              return (
                <li className='d-flex align-items-center position-relative mb-4 li-width' key={todo.id}>
                  <input type="checkbox" className='me-5 larger' onChange={() => handleComplete(todo.id)} checked={todo.completed ? true : false} />
                  <div className="w-100 h-100 d-flex align-items-center">
                    { !todo.edit ? (
                      <span className={ `text-size w-100 ${ todo.completed === true ? 'complete' : '' } `} onDoubleClick={ () => handleEdit(todo.id) }>{ todo.title }</span>
                    ) : (
                    <input type="text" className="edit-form text-size col-10" defaultValue={todo.title} onBlur={(e) => removeInput(e,todo.id)} onKeyDown={ (e) => {
                      if(e.keyCode === 13){
                        removeInput(e,todo.id);
                      }
                    } } autoFocus />
                    ) }
                    <span className="position-absolute size" onClick={() => handleDelete(todo.id)} >&times;</span>
                  </div>
                  
                </li>
              )
            })
          }
        </ul>
        <div className="d-flex justify-content-between align-items-center">
        <span className="">{ remaining } item left</span>
        <ul className="d-flex justify-content-between m-0 col-5 p-0" style={{fontSize: 1 +'rem'}}>
          
          <Link to='/' onClick={() => {
            setFilter('/')
            todosFilter('/')
          }}>All</Link>
          <Link to='/active' onClick={() => {
            setFilter('/active')
            todosFilter('/active')
          }}>Active</Link>
          <Link to='/completed' onClick={() => {
            setFilter('/completed')
            todosFilter('/completed')
          }}>Completed</Link>
           
        
        </ul>
        { completed ?(
          <span className="col-3"><Link to='/' onClick={() => clearCompleted()}>Clear Completed</Link></span>
        ) :  <span className="col-3"></span>}
      </div>
      </div>
    
      
    </div>
  );
  
}

export default App;
