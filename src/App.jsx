import { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import { useEffect } from 'react'
import { useRef } from 'react'

//const socket = io('http://localhost:8080') //CON ESTA VARIABLE VAMOS A PODER MANDAR OBJETOS Y ESCUCHAR OBJETOS AL SERVIDOR
const socket = io('https://chatappnodetest.herokuapp.com') //CON ESTA VARIABLE VAMOS A PODER MANDAR OBJETOS Y ESCUCHAR OBJETOS AL SERVIDOR

function App() {
  
  const messageEndRef = useRef(null); //PARA HACER SCROLL HASTA EL ÚLTIMO MENSAJE DEL CHAT
  const [mensajeEnviado, setMensajeEnviado] = useState('')
  const [mensajes, setMensajes] = useState([])


  const handeSubmit = (e) => {
    e.preventDefault()
    socket.emit('mensaje-cliente', mensajeEnviado)

    const nuevoMensaje = {
      body: mensajeEnviado,
      from: 'Me'
    }
    setMensajes([...mensajes, nuevoMensaje])
    setMensajeEnviado('') 

  }

  useEffect(() => {

    const recibirMensaje = (mensaje) => {
      setMensajes([...mensajes, mensaje])
    }

    socket.on('mensaje-servidor', recibirMensaje)

    return () => {
      socket.off('mensaje-servidor', recibirMensaje) //TERMINAMOS LA COMUNICACIÓN CON EL SERVER
    }



  }, [mensajes])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView()//CADA QUE HAYA UN MENSAJE NUEVO, HACEMOS AUTO SCROLL HASTA ESE MENSAJE
  }, [mensajes])
  

  

  return (
    <div className="container">
      <div className='chat-container'>
        {mensajes.map((mensaje, index) => (
          <div className='mensaje-container'>
            <div key={index} className={mensaje.from === 'Me' ? 'mensaje-usuario' : 'mensaje-externo '}>
              <p>{mensaje.body}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div> {/* =======HASTA AQUÍ SE VA A HACER EL AUTO SCROLL======== */}
      </div>
      <div className='form-container'>
        <form onSubmit={handeSubmit}>
          <input type="text"
            value={mensajeEnviado}
            onChange={(e) => {
              setMensajeEnviado(e.target.value)
            }}
          />
          <button className='btn-enviar'>Enviar</button>
        </form>

      </div>
    </div>
  )
}

export default App
