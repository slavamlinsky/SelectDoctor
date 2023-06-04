import styles from "./App.module.scss";
import FindDoctor from "./components/FindDoctor";
//import SelectDoctor from "./components/SelectDoctor";

function App() {
  return (
    <div className={styles.App}>
      <h1 className={styles.title}>Find Your Doctor</h1>
      <div className="flex flex-row justify-between">
        <FindDoctor />
      </div>
    </div>
  );
}

export default App;
