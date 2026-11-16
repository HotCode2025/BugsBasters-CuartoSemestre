import React, { useState } from 'react'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validamos e imprimimos el objeto exacto en la consola como el profesor
    console.log({
      name,
      email,
      password
    });
  };

  return (
    <div className='h-[calc(100vh-64px)] flex items-center justify-center'>
      <Card>
        <h3 className='text-2xl font-bold text-yellow-300 mb-4'>Registro</h3>
        <form onSubmit={handleSubmit}>
          <Input 
            placeholder="Ingrese su nombre" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            type="email" 
            placeholder="Ingrese su email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Ingrese su contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button>Registrarse</Button>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
