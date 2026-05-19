import Welcome from './components/Home/Welcome';
import Goals from './components/Home/Goals';
import Todo from './components/Home/Todo';

const Home = (styles) => {
    return (
        <div className="homepage pages" { ...styles }>
            <Welcome />
            <Goals />
            <Todo />
        </div>
    );
}

export default Home;
