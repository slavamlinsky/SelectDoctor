import styles from "./App.module.scss";

import SelectDoctor from "./components/SelectDoctor";

function App() {
  return (
    <div className={styles.App}>
      <h1 className={styles.title}>Choose Your Doctor</h1>
      <div className="flex flex-row justify-between">
        <SelectDoctor />
      </div>
    </div>
  );
}

export default App;
