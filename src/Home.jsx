const Home = (styles) => {
    var todo1 = localStorage.getItem('todo1');
    var todo2 = localStorage.getItem('todo2');
    var todo3 = localStorage.getItem('todo3');
    var todo4 = localStorage.getItem('todo4');

    if(!todo1 || todo1 == ' '){
        todo1 = 'Things to do:';
    }
    if(!todo2 || todo22 == ' '){
        todo2 = 'Things to do:';
    }
    if(!todo3 || todo3 == ' '){
        todo3 = 'Things to do:';
    }
    if(!todo4 || todo4 == ' '){
        todo4 = 'Things to do:';
    }

    const todolog1 = (tododata) => {
        localStorage.setItem('todo1', tododata.target.value);
    }
    const todolog2 = (tododata) => {
        localStorage.setItem('todo2', tododata.target.value);
    }
    const todolog3 = (tododata) => {
        localStorage.setItem('todo3', tododata.target.value);
    }
    const todolog4 = (tododata) => {
        localStorage.setItem('todo4', tododata.target.value);
    }

    return (
        <div className="homepage pages" { ...styles }>
            <div className="welcome">
                <h2>Welcome!</h2>
            </div>
            <div className="goal">
                <h2>Goals</h2>
            </div>
            <div className="todo">
                <h2>To-do list</h2>
                <input type="text" placeholder={todo1} id="todo1" onChange={ todolog1 }/>
                <input type="text" placeholder={todo2} id="todo2" onChange={ todolog2 }/>
                <input type="text" placeholder={todo3} id="todo3" onChange={ todolog3 }/>
                <input type="text" placeholder={todo4} id="todo4" onChange={ todolog4 }/>
            </div>
        </div>
    );
}
 
export default Home;