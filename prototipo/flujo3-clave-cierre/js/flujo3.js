// Flujo 3 (P5 a P8), Eduardo Jaque
// La clave nunca se guarda, solo se marca como creada

const Flujo3 = (() => {
  const REGLAS = {
    largo: v => v.length >= 8,
    numero: v => /\d/.test(v),
    mayuscula: v => /[A-ZÁÉÍÓÚÑ]/.test(v),
    minuscula: v => /[a-záéíóúñ]/.test(v),
    espacios: v => v.length > 0 && !/\s/.test(v),
  };

  function exigirPasoPrevio(paso, destino) {
    if ((App.leer().pasoCompletado || 0) < paso) { window.location.href = destino; return false; }
    return true;
  }

  function botonesVer() {
    document.querySelectorAll('[data-ver]').forEach(b => {
      b.addEventListener('click', () => {
        const input = document.getElementById(b.dataset.ver);
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        b.setAttribute('aria-pressed', String(!visible));
        b.textContent = visible ? '👁 Ver' : '👁 Ocultar';
      });
    });
  }

  function pantallaClave() {
    App.iniciar({ paso: 4 });
    if (!exigirPasoPrevio(3, '../flujo2-contacto-verificacion/p4-verificar-celular.html')) return;
    botonesVer();

    const clave = document.getElementById('clave');
    const repetida = document.getElementById('clave-repetida');
    const items = document.querySelectorAll('#requisitos [data-regla]');

    const revisar = () => {
      items.forEach(li => li.classList.toggle('cumple', REGLAS[li.dataset.regla](clave.value)));
    };
    clave.addEventListener('input', revisar);

    document.getElementById('form-clave').addEventListener('submit', e => {
      e.preventDefault();
      const ok = App.validar([
        {
          input: clave,
          validar: v => {
            if (!v) return 'Falta crear tu clave.';
            const pendientes = [...items].filter(li => !REGLAS[li.dataset.regla](clave.value));
            if (pendientes.length) return `A tu clave le falta: ${pendientes.map(li => li.textContent.toLowerCase()).join(', ')}.`;
            return null;
          },
        },
        {
          input: repetida,
          validar: v => {
            if (!v) return 'Escribe la clave otra vez para confirmar que la recuerdas.';
            if (v !== clave.value) return 'Las dos claves no son iguales. Escríbela de nuevo con calma, puedes tocar "Ver" para revisarla.';
            return null;
          },
        },
      ]);
      if (!ok) return;
      App.guardar({ claveCreada: true, pasoCompletado: Math.max(4, App.leer().pasoCompletado || 0) });
      clave.value = repetida.value = '';
      window.location.href = 'p6-condiciones.html';
    });
  }

  function pantallaCondiciones() {
    App.iniciar({ paso: 5 });
    if (!exigirPasoPrevio(4, 'p5-clave.html')) return;
    const datos = App.leer();
    const obligatoria = document.getElementById('acepta-condiciones');
    const ofertas = document.getElementById('acepta-ofertas');
    const error = document.getElementById('error-condiciones');
    obligatoria.checked = !!datos.aceptaCondiciones;
    ofertas.checked = !!datos.aceptaOfertas;
    obligatoria.addEventListener('change', () => { if (obligatoria.checked) error.hidden = true; });

    document.getElementById('form-condiciones').addEventListener('submit', e => {
      e.preventDefault();
      if (!obligatoria.checked) {
        error.hidden = false;
        obligatoria.focus();
        return;
      }
      App.guardar({ aceptaCondiciones: true, aceptaOfertas: ofertas.checked, pasoCompletado: 5 });
      window.location.href = 'p7-revision.html';
    });
  }

  // Llena los elementos data-dato con los datos de la sesion
  function rellenar(datos) {
    const porWhatsapp = datos.canal === 'whatsapp';
    const extra = {
      nombreCompleto: `${datos.nombre || ''} ${datos.apellidos || ''}`.trim(),
      celularCompleto: datos.celular ? `+56 9 ${datos.celular}${datos.celularVerificado ? ' (confirmado)' : ''}` : '',
      correoTexto: datos.correo ? `${datos.correo} (por confirmar)` : 'No ingresado',
      canalTexto: porWhatsapp ? 'Por WhatsApp' : 'Por correo electrónico',
      ofertas: datos.aceptaOfertas ? 'Sí, quiero recibirlas' : 'No',
      mensajeCanal: porWhatsapp
        ? 'Tus boletas y avisos de compra te llegarán por WhatsApp, desde la cuenta oficial verificada de la tienda. Nunca te pediremos tu clave por ese medio.'
        : 'Tus boletas y avisos de compra te llegarán a tu correo electrónico.',
      mensajeCorreo: datos.correo
        ? 'También te enviamos un enlace a tu correo para confirmarlo cuando puedas. Tu cuenta ya funciona aunque todavía no lo confirmes.'
        : '',
    };
    document.querySelectorAll('[data-dato]').forEach(el => {
      el.textContent = extra[el.dataset.dato] ?? datos[el.dataset.dato] ?? '';
      if (el.matches('p') && !el.textContent) el.hidden = true;
    });
  }

  function pantallaRevision() {
    App.iniciar();
    if (!exigirPasoPrevio(5, 'p6-condiciones.html')) return;
    rellenar(App.leer());
    document.getElementById('crear-cuenta').addEventListener('click', () => {
      App.guardar({ cuentaCreada: true });
      window.location.href = 'p8-confirmacion.html';
    });
  }

  function pantallaConfirmacion() {
    App.iniciar();
    const datos = App.leer();
    if (!datos.cuentaCreada) { window.location.href = 'p7-revision.html'; return; }
    rellenar(datos);
    // Borra los datos de prueba al salir
    document.getElementById('ir-a-comprar').addEventListener('click', () => App.borrar());
  }

  return { pantallaClave, pantallaCondiciones, pantallaRevision, pantallaConfirmacion };
})();
