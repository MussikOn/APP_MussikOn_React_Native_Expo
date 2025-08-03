const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testDepositWithUser() {
  try {
    console.log('🧪 Probando endpoint de depósito con usuario específico...\n');

    // 1. Hacer login con el usuario proporcionado
    console.log('🔐 Haciendo login con usuario...');
    const loginResponse = await axios.post('http://192.168.54.26:3001/auth/login', {
      userEmail: 'astacionsanchezjefryagustin@gmail.com',
      userPassword: 'P0pok@tepel01'
    });

    console.log('✅ Login exitoso');
    console.log('Usuario:', loginResponse.data.user.userEmail);
    console.log('Nombre:', loginResponse.data.user.name, loginResponse.data.user.lastName);
    console.log('Rol:', loginResponse.data.user.roll);
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...\n');

    const token = loginResponse.data.token;

    // 2. Crear un archivo de prueba
    const testContent = 'Test deposit voucher content for user test';
    fs.writeFileSync('test_voucher.txt', testContent);

    // 3. Crear FormData para el depósito
    const formData = new FormData();
    formData.append('amount', '250.75');
    formData.append('description', 'Depósito de prueba desde script con usuario real');
    formData.append('voucherFile', fs.createReadStream('test_voucher.txt'), {
      filename: 'test_voucher.txt',
      contentType: 'text/plain'
    });

    console.log('📤 Datos que se envían al endpoint de depósito:');
    console.log('- amount: 250.75');
    console.log('- description: Depósito de prueba desde script con usuario real');
    console.log('- voucherFile: test_voucher.txt');
    console.log('- Authorization: Bearer ' + token.substring(0, 20) + '...\n');

    // 4. Hacer la petición de depósito
    console.log('🔍 Probando endpoint de depósito...');
    const depositResponse = await axios.post('http://192.168.54.26:3001/payment-system/deposit', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      },
      timeout: 15000
    });

    console.log('✅ Respuesta exitosa del endpoint de depósito:');
    console.log('Status:', depositResponse.status);
    console.log('Data:', JSON.stringify(depositResponse.data, null, 2));

    // 5. Análisis detallado de la respuesta
    console.log('\n📋 Análisis detallado de la respuesta:');
    if (depositResponse.data.success) {
      console.log('✅ Success: true');
      console.log('📊 Datos del depósito creado:');
      console.log('- ID:', depositResponse.data.data.id);
      console.log('- User ID:', depositResponse.data.data.userId);
      console.log('- Amount:', depositResponse.data.data.amount);
      console.log('- Currency:', depositResponse.data.data.currency);
      console.log('- Status:', depositResponse.data.data.status);
      console.log('- Description:', depositResponse.data.data.description);
      console.log('- Created At:', depositResponse.data.data.createdAt);
      console.log('- Updated At:', depositResponse.data.data.updatedAt);
      
      if (depositResponse.data.data.voucherFile) {
        console.log('- Voucher File URL:', depositResponse.data.data.voucherFile.url);
        console.log('- Voucher File Name:', depositResponse.data.data.voucherFile.filename);
        console.log('- Voucher Uploaded At:', depositResponse.data.data.voucherFile.uploadedAt);
      }
    }

    // 6. Verificar que el depósito se guardó correctamente
    console.log('\n🔍 Verificando que el depósito se guardó en la base de datos...');
    try {
      const depositsResponse = await axios.get('http://192.168.54.26:3001/payment-system/my-deposits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Depósitos del usuario obtenidos:');
      console.log('Status:', depositsResponse.status);
      console.log('Total de depósitos:', depositsResponse.data.data?.length || 0);
      
      if (depositsResponse.data.data && depositsResponse.data.data.length > 0) {
        console.log('📋 Último depósito:');
        const lastDeposit = depositsResponse.data.data[0];
        console.log('- ID:', lastDeposit.id);
        console.log('- Amount:', lastDeposit.amount);
        console.log('- Status:', lastDeposit.status);
        console.log('- Created At:', lastDeposit.createdAt);
      }
      
    } catch (error) {
      console.log('⚠️ No se pudo verificar los depósitos:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Error en la petición:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('\n💡 Error de autenticación');
        console.log('💡 Verifica que las credenciales sean correctas');
      } else if (error.response.status === 400) {
        console.log('\n💡 Error en los datos enviados');
        console.log('💡 Verifica el formato de los datos');
      }
    } else if (error.request) {
      console.log('Error de red:', error.message);
      console.log('💡 Verifica que el backend esté ejecutándose');
    } else {
      console.log('Error:', error.message);
    }
  } finally {
    // Limpiar archivo de prueba
    if (fs.existsSync('test_voucher.txt')) {
      fs.unlinkSync('test_voucher.txt');
    }
  }
}

// Ejecutar la prueba
testDepositWithUser(); 