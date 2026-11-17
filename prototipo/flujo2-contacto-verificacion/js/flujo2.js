// Flujo 2 (P3 y P4), Carolina Vallejos
// El celular es el dato principal y el correo es opcional

const Flujo2 = (() => {
  const ANTERIOR = '../flujo1-inicio-identificacion/p2-datos-personales.html';
  const SIGUIENTE = '../flujo3-clave-cierre/p5-clave.html';
  const ESPERA_REENVIO = 60; // segundos

  function validarCorreo(valor) {
    if (!valor) return 'Escribe tu correo o elige "No tengo o no lo uso".';
    if (!valor.includes('@')) return 'Revisa tu correo: debe tener una @, por ejemplo nombre@gmail.com.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return 'Revisa tu correo: después de la @ debe ir algo como gmail.com o hotmail.com.';
    return null;
  }

  function validarCelular(valor) {
    const numeros = valor.replace(/\D/g, '');
    if (!numeros) return 'Falta tu número de celular.';
    if (numeros.length !== 8) return `Revisa tu celular: deben ser 8 números después del 9 y escribiste ${numeros.length}.`;
    return null;
  }

  function generarCodigo() {
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    App.guardar({ codigoSimulado: codigo });
    return codigo;
  }

  const valorRadio = nombre => document.querySelector(`input[name="${nombre}"]:checked`)?.value || '';

  function mostrarError(id, mensaje) {
    const el = document.getElementById(id);
    el.textContent = mensaje || '';
    el.style.display = mensaje ? 'block' : 'none';
  }

  // P3 celular, correo opcional y canal
  function pantallaContacto() {
    App.iniciar({ paso: 2 });
    const datos = App.leer();
    if (!datos.rut) { window.location.href = ANTERIOR; return; } // falta el paso 1

    const celular = document.getElementById('celular');
    const correo = document.getElementById('correo');
    const bloqueCorreo = document.getElementById('bloque-correo');
    const bloqueWhatsapp = document.getElementById('bloque-whatsapp');
    const consentimiento = document.getElementById('consentimiento-whatsapp');
    const opcionCanalCorreo = document.getElementById('opcion-canal-correo');

    // Recupera lo escrito si vuelve a esta pantalla
    celular.value = datos.celular || '';
    correo.value = datos.correo || '';
    if (datos.tieneCorreo) document.querySelector(`input[name="tieneCorreo"][value="${datos.tieneCorreo}"]`).checked = true;
    document.querySelector(`input[name="canal"][value="${datos.canal || 'whatsapp'}"]`).checked = true;
    consentimiento.checked = !!datos.consentimientoWhatsapp;

    const actualizar = () => {
      const tieneCorreo = valorRadio('tieneCorreo') === 'si';
      bloqueCorreo.hidden = !tieneCorreo;
      // Sin correo solo queda WhatsApp
      opcionCanalCorreo.hidden = !tieneCorreo;
      if (!tieneCorreo && valorRadio('canal') === 'correo') {
        document.querySelector('input[name="canal"][value="whatsapp"]').checked = true;
      }
      bloqueWhatsapp.hidden = valorRadio('canal') !== 'whatsapp';
    };
    document.querySelectorAll('input[name="tieneCorreo"], input[name="canal"]').forEach(r =>
      r.addEventListener('change', actualizar));
    actualizar();

    // Formato 1234 5678
    celular.addEventListener('input', () => {
      const n = celular.value.replace(/\D/g, '').slice(0, 8);
      celular.value = n.length > 4 ? `${n.slice(0, 4)} ${n.slice(4)}` : n;
    });
    consentimiento.addEventListener('change', () => mostrarError('err-consentimiento', null));

    document.getElementById('form-contacto').addEventListener('submit', e => {
      e.preventDefault();
      const tieneCorreo = valorRadio('tieneCorreo');
      const canal = valorRadio('canal');
      const reglas = [{ input: celular, validar: validarCelular }];
      if (tieneCorreo === 'si') reglas.push({ input: correo, validar: validarCorreo });
      let ok = App.validar(reglas);

      if (!tieneCorreo) {
        mostrarError('err-tiene-correo', 'Cuéntanos si tienes correo electrónico. Si no lo usas, elige "No tengo o no lo uso".');
        ok = false;
      } else mostrarError('err-tiene-correo', null);

      if (canal === 'whatsapp' && !consentimiento.checked) {
        mostrarError('err-consentimiento', 'Para enviarte tus boletas por WhatsApp necesitamos tu autorización. Marca la casilla o elige recibirlas por correo.');
        if (ok) consentimiento.focus();
        ok = false;
      }
      if (!ok) return;

      const celularNuevo = celular.value.trim();
      const cambioCelular = celularNuevo !== datos.celular;
      App.guardar({
        celular: celularNuevo,
        tieneCorreo,
        correo: tieneCorreo === 'si' ? correo.value.trim().toLowerCase() : '',
        correoPorConfirmar: tieneCorreo === 'si',
        canal,
        consentimientoWhatsapp: canal === 'whatsapp' && consentimiento.checked,
        pasoCompletado: 2,
        ...(cambioCelular ? { celularVerificado: false, codigoSimulado: null } : {}),
      });
      window.location.href = 'p4-verificar-celular.html';
    });
  }

  // P4 codigo por SMS con sugerencia simulada del teclado
  function iniciarCuentaRegresiva() {
    const espera = document.getElementById('reenviar-espera');
    const seg = document.getElementById('segundos');
    const boton = document.getElementById('reenviar');
    let restante = ESPERA_REENVIO;
    seg.textContent = restante;
    espera.hidden = false;
    boton.hidden = true;
    const t = setInterval(() => {
      restante -= 1;
      seg.textContent = restante;
      if (restante <= 0) {
        clearInterval(t);
        espera.hidden = true;
        boton.hidden = false;
      }
    }, 1000);
  }

  function pantallaVerificarCelular() {
    App.iniciar({ paso: 3 });
    const datos = App.leer();
    if (!datos.celular) { window.location.href = 'p3-contacto.html'; return; }

    document.getElementById('celular-destino').textContent = `+56 9 ${datos.celular}`;
    const input = document.getElementById('codigo');
    const sugerencia = document.getElementById('sugerencia');
    const codigoSugerido = document.getElementById('codigo-sugerido');
    codigoSugerido.textContent = datos.codigoSimulado || generarCodigo();
    iniciarCuentaRegresiva();

    // Simula la sugerencia del teclado al tocar el campo
    input.addEventListener('focus', () => { sugerencia.hidden = false; });
    document.getElementById('usar-codigo').addEventListener('click', () => {
      input.value = codigoSugerido.textContent;
      sugerencia.hidden = true;
      App.limpiarError(input);
      input.focus();
    });
    input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 6); });

    document.getElementById('reenviar').addEventListener('click', () => {
      codigoSugerido.textContent = generarCodigo();
      input.value = '';
      sugerencia.hidden = false;
      input.focus();
      iniciarCuentaRegresiva();
    });

    document.getElementById('form-codigo').addEventListener('submit', e => {
      e.preventDefault();
      const esperado = App.leer().codigoSimulado;
      const ok = App.validar([{
        input,
        validar: v => {
          if (!v) return 'Falta el código. Son los 6 números del mensaje de texto que te enviamos.';
          if (v.length !== 6) return `El código tiene 6 números y escribiste ${v.length}. Revísalo con calma.`;
          if (v !== esperado) return 'Ese código no coincide. Revisa el último SMS que te enviamos o pide uno nuevo.';
          return null;
        },
      }]);
      if (!ok) return;
      App.guardar({ celularVerificado: true, pasoCompletado: 3 });
      window.location.href = SIGUIENTE;
    });
  }

  return { pantallaContacto, pantallaVerificarCelular };
})();
