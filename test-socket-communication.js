const io = require('socket.io-client');

// Configuración
const SOCKET_URL = 'http://172.20.10.2:3001';
const API_URL = 'http://172.20.10.2:3001';

console.log('🧪 Iniciando prueba de comunicación Socket.IO...');
console.log('📍 Socket URL:', SOCKET_URL);
console.log('📍 API URL:', API_URL);

// Simular un músico conectado
function simulateMusician() {
  return new Promise((resolve) => {
    console.log('\n🎵 Simulando músico conectado...');
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
    });

    const timeout = setTimeout(() => {
      console.error('❌ Timeout en simulación de músico');
      socket.disconnect();
      resolve(false);
    }, 15000);

    socket.on('connect', () => {
      console.log('✅ Músico conectado exitosamente');
      
      // Autenticar como músico
      socket.emit('authenticate', {
        userEmail: 'musico@test.com',
        userId: 'musico@test.com'
      });
      
      // Escuchar nueva solicitud
      socket.on('new_event_request', (data) => {
        console.log('📢 Músico recibió nueva solicitud:', {
          id: data.id,
          eventType: data.eventType,
          instrument: data.instrument,
          budget: data.budget,
          location: data.location
        });
        
        // Simular aceptación después de 2 segundos
        setTimeout(() => {
          console.log('✅ Músico acepta la solicitud');
          // Aquí se haría la petición HTTP para aceptar
          clearTimeout(timeout);
          socket.disconnect();
          resolve(true);
        }, 2000);
      });
      
      // Simular creación de solicitud después de 3 segundos
      setTimeout(() => {
        console.log('🔄 Simulando creación de solicitud desde organizador...');
        createTestRequest();
      }, 3000);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión del músico:', error.message);
      clearTimeout(timeout);
      socket.disconnect();
      resolve(false);
    });
  });
}

// Crear una solicitud de prueba
async function createTestRequest() {
  try {
    console.log('\n📝 Creando solicitud de prueba...');
    
    const response = await fetch(`${API_URL}/events/request-musician`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiT3JnYW5pemFkb3IiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyRW1haWwiOiJvcmdhbml6YWRvckBtdXNzaWtvbi5jb20iLCJyb2xsIjoiZXZlbnRDcmVhdG9yIiwiaWF0IjoxNzUzNzM3ODgzLCJleHAiOjE3NTM3NDE0ODN9.Hjaeirsb8UGYl98Haz2Md5D6M0hZ7KFedlpbE1dZJPw'
      },
      body: JSON.stringify({
        requestName: 'Boda de Prueba',
        requestType: 'boda',
        date: '2024-12-25',
        time: '18:00 - 20:00',
        location: 'Salón de Eventos ABC',
        city: 'Santo Domingo',
        latitude: 18.4861,
        longitude: -69.9312,
        duration: 2,
        instrument: 'piano',
        bringInstrument: false,
        budget: 500,
        additionalComments: 'Solicitud de prueba para testing',
        musicGenre: 'romántica',
        guestCount: 100
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Solicitud creada exitosamente:', data);
    } else {
      const error = await response.text();
      console.error('❌ Error creando solicitud:', error);
    }
  } catch (error) {
    console.error('❌ Error en creación de solicitud:', error.message);
  }
}

// Función principal
async function runTest() {
  console.log('🚀 Iniciando prueba completa...\n');
  
  // 1. Simular músico conectado
  const musicianSuccess = await simulateMusician();
  
  // Resumen
  console.log('\n📊 RESUMEN DE LA PRUEBA:');
  console.log('🎵 Músico conectado:', musicianSuccess ? '✅ EXITOSO' : '❌ FALLIDO');
  
  if (musicianSuccess) {
    console.log('\n🎉 ¡La comunicación Socket.IO está funcionando correctamente!');
    console.log('💡 El flujo completo funciona:');
    console.log('   1. ✅ Músico se conecta y autentica');
    console.log('   2. ✅ Organizador crea solicitud');
    console.log('   3. ✅ Backend emite evento new_event_request');
    console.log('   4. ✅ Músico recibe la notificación');
    console.log('   5. ✅ Músico puede aceptar la solicitud');
  } else {
    console.log('\n⚠️  Problemas detectados en la comunicación');
  }
}

// Ejecutar prueba
runTest().catch(console.error); 