import './App.css'

import React, { useState, useEffect, useMemo } from 'react'

function App () {
  const [tareas, setTareas] = useState([])
  const [nuevaTarea, setNuevaTarea] = useState('')
  const [duracion, setDuracion] = useState('')
  const [filtroDuracion, setFiltroDuracion] = useState('')
  const [soloRecientes, setSoloRecientes] = useState(false)
  const [modoOscuro, setModoOscuro] = useState(false)

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const tareasGuardadas = localStorage.getItem('tareas')
    if (tareasGuardadas) {
      setTareas(JSON.parse(tareasGuardadas))
    }
    const modoGuardado = localStorage.getItem('modoOscuro')
    if (modoGuardado) {
      setModoOscuro(modoGuardado === 'true')
    }
  }, [])

  // Guardar tareas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
  }, [tareas])

  // Guardar modo oscuro en localStorage
  useEffect(() => {
    localStorage.setItem('modoOscuro', modoOscuro)
  }, [modoOscuro])

  // Cálculo de tiempo total optimizado con useMemo
  const calcularTiempoTotal = useMemo(() => {
    return tareas.reduce((total, tarea) => total + tarea.duracion, 0)
  }, [tareas])

  // Efecto secundario: Actualizar el título del documento cada vez que cambia el total
  useEffect(() => {
    document.title = `Total: ${calcularTiempoTotal} minutos`
  }, [calcularTiempoTotal])

  // Función para agregar una nueva tarea
  const agregarTarea = () => {
    if (nuevaTarea && duracion) {
      const nuevaTareaObj = {
        nombre: nuevaTarea,
        duracion: parseInt(duracion),
        fecha: Date.now()
      }
      setTareas([...tareas, nuevaTareaObj])
      setNuevaTarea('')
      setDuracion('')
    }
  }

  // Filtrado de tareas
  const tareasFiltradas = useMemo(() => {
    let filtradas = tareas
    if (filtroDuracion) {
      filtradas = filtradas.filter(t => t.duracion >= parseInt(filtroDuracion))
    }
    if (soloRecientes) {
      // Mostrar solo las tareas agregadas en los últimos 5 minutos
      const cincoMinutos = 5 * 60 * 1000
      const ahora = Date.now()
      filtradas = filtradas.filter(t => ahora - t.fecha <= cincoMinutos)
    }
    return filtradas
  }, [tareas, filtroDuracion, soloRecientes])

  return (
    <div className={`contenedor${modoOscuro ? ' oscuro' : ''}`}>
      <button
        className='boton-modo'
        onClick={() => setModoOscuro(m => !m)}
      >
        {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <h1>Contador de Tareas</h1>
      <div className='formulario'>
        <input
          type='text'
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder='Nombre de la tarea'
        />
        <input
          type='number'
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          placeholder='Duración en minutos'
        />
        <button onClick={agregarTarea}>Agregar tarea</button>
      </div>

      <div className='filtros'>
        <input
          type='number'
          value={filtroDuracion}
          onChange={e => setFiltroDuracion(e.target.value)}
          placeholder='Filtrar por duración mínima'
        />
        <label>
          <input
            type='checkbox'
            checked={soloRecientes}
            onChange={e => setSoloRecientes(e.target.checked)}
          />
          Mostrar solo tareas recientes (últimos 5 min)
        </label>
      </div>

      <h2>Tareas</h2>
      <ul>
        {tareasFiltradas.map((tarea, index) => (
          <li key={index}>
            <span className='nombre-tarea'>{tarea.nombre}</span>:
            <span className='duracion-tarea'> {tarea.duracion} minutos</span>
          </li>
        ))}
      </ul>

      <h3>Total de tiempo: {calcularTiempoTotal} minutos</h3>
    </div>
  )
}

export default App
