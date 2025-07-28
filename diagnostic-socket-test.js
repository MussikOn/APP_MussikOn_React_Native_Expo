const io = require('socket.io-client');

// Configuración
const SOCKET_URL = 'http://172.20.10.2:3001';
const API_URL = 'http://172.20.10.2:3001';

console.log('🔍 Iniciando diagnóstico de Socket.IO...');
console.log('📍 Socket URL:', SOCKET_URL);
console.log('📍 API URL:', API_URL);

// Función para probar conexión HTTP
async function testHttpConnection() {
  try {
    console.log('\n🌐 Probando conexión HTTP...');
    const response = await fetch(`${API_URL}/test`);
    const data = await response.json();
    console.log('✅ Conexión HTTP exitosa:', data);
    return true;
  } catch (error) {
    console.error('❌ Error en conexión HTTP:', error.message);
    return false;
  }
}

// Función para probar Socket.IO
function testSocketConnection() {
  return new Promise((resolve) => {
    console.log('\n🔌 Probando conexión Socket.IO...');
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    const timeout = setTimeout(() => {
      console.error('❌ Timeout en conexión Socket.IO');
      socket.disconnect();
      resolve(false);
    }, 10000);

    socket.on('connect', () => {
      console.log('✅ Socket.IO conectado exitosamente');
      console.log('🆔 Socket ID:', socket.id);
      
      // Probar autenticación
      socket.emit('authenticate', {
        userEmail: 'test@mussikon.com',
        userId: 'test@mussikon.com'
      });
      
      clearTimeout(timeout);
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error.message);
      clearTimeout(timeout);
      socket.disconnect();
      resolve(false);
    });

    socket.on('authenticated', (data) => {
      console.log('✅ Usuario autenticado:', data);
    });
  });
}

// Función para probar eventos de solicitudes
function testRequestEvents() {
  return new Promise((resolve) => {
    console.log('\n📢 Probando eventos de solicitudes...');
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    const timeout = setTimeout(() => {
      console.error('❌ Timeout en eventos de solicitudes');
      socket.disconnect();
      resolve(false);
    }, 15000);

    socket.on('connect', () => {
      console.log('✅ Socket conectado para pruebas de eventos');
      
      // Autenticar
      socket.emit('authenticate', {
        userEmail: 'musico@test.com',
        userId: 'musico@test.com'
      });
      
      // Escuchar eventos
      socket.on('new_event_request', (data) => {
        console.log('📢 Evento new_event_request recibido:', data);
      });
      
      socket.on('musician_accepted', (data) => {
        console.log('📢 Evento musician_accepted recibido:', data);
      });
      
      socket.on('request_cancelled', (data) => {
        console.log('📢 Evento request_cancelled recibido:', data);
      });
      
      // Simular creación de solicitud después de 5 segundos
      setTimeout(() => {
        console.log('🔄 Simulando creación de solicitud...');
        // Aquí podrías hacer una petición HTTP para crear una solicitud
        clearTimeout(timeout);
        socket.disconnect();
        resolve(true);
      }, 5000);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      clearTimeout(timeout);
      socket.disconnect();
      resolve(false);
    });
  });
}

// Función principal
async function runDiagnostic() {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  // 1. Probar conexión HTTP
  const httpSuccess = await testHttpConnection();
  
  // 2. Probar conexión Socket.IO
  const socketSuccess = await testSocketConnection();
  
  // 3. Probar eventos de solicitudes
  const eventsSuccess = await testRequestEvents();
  
  // Resumen
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log('🌐 Conexión HTTP:', httpSuccess ? '✅ EXITOSA' : '❌ FALLIDA');
  console.log('🔌 Conexión Socket.IO:', socketSuccess ? '✅ EXITOSA' : '❌ FALLIDA');
  console.log('📢 Eventos de solicitudes:', eventsSuccess ? '✅ EXITOSA' : '❌ FALLIDA');
  
  if (httpSuccess && socketSuccess) {
    console.log('\n🎉 ¡El backend está funcionando correctamente!');
    console.log('💡 El problema puede estar en:');
    console.log('   - Configuración de IP en el frontend');
    console.log('   - Autenticación de usuarios');
    console.log('   - Emisión de eventos desde el backend');
  } else {
    console.log('\n⚠️  Problemas detectados:');
    if (!httpSuccess) {
      console.log('   - El backend no está ejecutándose');
      console.log('   - Problema de red/firewall');
      console.log('   - URL incorrecta');
    }
    if (!socketSuccess) {
      console.log('   - Socket.IO no está configurado correctamente');
      console.log('   - Problema de CORS');
      console.log('   - Puerto bloqueado');
    }
  }
}

// Ejecutar diagnóstico
runDiagnostic().catch(console.error); 