import { useReducer, useRef, useEffect, useState } from "react";

const initialState = { count: 0, history: [] };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { 
        count: state.count + action.value, 
        history: [
          ...state.history, 
          `+${action.value} (Nuevo valor: ${state.count + action.value})`
        ] 
      };
    case "decrement":
      return { 
        count: state.count - 1, 
        history: [
          ...state.history, 
          `-1 (Nuevo valor: ${state.count - 1})`
        ] 
      };
    case "reset":
      return initialState;
    case "undo":
      { if (state.history.length === 0) return state;
      // Obtener el historial anterior
      const prevHistory = state.history.slice(0, -1);
      // Calcular el valor anterior del contador
      let prevCount = 0;
      if (prevHistory.length > 0) {
        const lastEntry = prevHistory[prevHistory.length - 1];
        const match = lastEntry.match(/Nuevo valor: (-?\d+)/);
        if (match) prevCount = parseInt(match[1]);
      }
      return {
        count: prevCount,
        history: prevHistory
      }; }
    case "setHistory":
      // Para inicializar desde localStorage
      return {
        ...state,
        history: action.history,
        count: action.count
      };
    default:
      return state;
  }
}

function CounterGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState(1);
  const incrementBtnRef = useRef(null);

  // Fijar el foco en el botón de incremento al renderizar
  useEffect(() => {
    if (incrementBtnRef.current) {
      incrementBtnRef.current.focus();
    }
  }, []);

  // Guardar historial en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("counterHistory", JSON.stringify(state.history));
    localStorage.setItem("counterValue", state.count);
  }, [state.history, state.count]);

  // Recuperar historial y valor al cargar
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("counterHistory")) || [];
    const savedCount = parseInt(localStorage.getItem("counterValue")) || 0;
    if (savedHistory.length > 0 || savedCount !== 0) {
      dispatch({ type: "setHistory", history: savedHistory, count: savedCount });
    }
  }, []);

  return (
    <div>
      <h2>Contador: {state.count}</h2>
      <input
        type="number"
        value={inputValue}
        min={1}
        onChange={e => setInputValue(Number(e.target.value))}
        style={{ width: "60px", marginRight: "8px" }}
      />
      <button
        ref={incrementBtnRef}
        onClick={() => dispatch({ type: "increment", value: inputValue })}
      >
        + 
      </button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "undo" })}>Deshacer</button>

      <h3>Historial de cambios:</h3>
      <ul>
        {state.history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}

export default CounterGame;