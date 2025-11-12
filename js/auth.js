/**
 * ============================================
 * MÓDULO DE AUTENTICACIÓN
 * ============================================
 * Maneja todo lo relacionado con login, logout y verificación de sesión
 */

const AuthModule = (function() {
  'use strict';

  const config = window.APP_CONFIG.AUTH;
  const messages = window.APP_CONFIG.MESSAGES;

  /**
   * Realiza el login del usuario
   * @returns {boolean} True si el login fue exitoso
   */
  function login() {
    const username = document.getElementById("usuario").value;
    const password = document.getElementById("clave").value;
    
    if (username === config.USERNAME && password === config.PASSWORD) {
      // Guardar el estado de la sesión
      sessionStorage.setItem(config.SESSION_KEY, 'true');
      
      // Ocultar formulario de login
      const loginDiv = document.getElementById("login");
      if (loginDiv) loginDiv.style.display = "none";
      
      // Mostrar opciones
      NavigationModule.showTypeSelector();
      return true;
    } else {
      alert(messages.LOGIN_ERROR);
      return false;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  function logout() {
    sessionStorage.removeItem(config.SESSION_KEY);
    
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/') && !currentPath.endsWith('index.html');
    
    if (isInSubfolder) {
      // Si estamos en una subcarpeta, redirigir al index
      window.location.href = window.APP_CONFIG.PATHS.INDEX;
    } else {
      // Si estamos en el index, limpiar la interfaz
      resetLoginInterface();
    }
  }

  /**
   * Resetea la interfaz al estado de login
   */
  function resetLoginInterface() {
    const loginDiv = document.getElementById("login");
    const menuDiv = document.getElementById("menu");
    const recuperacionDiv = document.getElementById("recuperacion");
    
    // Limpiar menús dinámicos
    NavigationModule.clearDynamicMenus();
    
    // Ocultar menús
    if (menuDiv) menuDiv.style.display = "none";
    if (recuperacionDiv) recuperacionDiv.style.display = "none";
    
    // Mostrar login
    if (loginDiv) {
      loginDiv.style.display = "block";
      clearLoginFields();
    }
  }

  /**
   * Limpia los campos del formulario de login
   */
  function clearLoginFields() {
    const usernameInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("clave");
    
    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  function isAuthenticated() {
    return sessionStorage.getItem(config.SESSION_KEY) === 'true';
  }

  /**
   * Verifica la autenticación al cargar la página
   * Maneja redirecciones según el estado de autenticación
   * @returns {boolean} Estado de autenticación
   */
  function checkAuthentication() {
    const authenticated = isAuthenticated();
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || 
                       currentPath.endsWith('/') || 
                       currentPath === '/';
    
    if (!isIndexPage && !authenticated) {
      // Página protegida sin autenticación -> redirigir
      console.log(messages.SESSION_EXPIRED);
      window.location.href = window.APP_CONFIG.PATHS.LOGIN_REDIRECT;
      return false;
    } 
    
    if (isIndexPage && authenticated) {
      // En index y autenticado -> verificar navegación
      handleAuthenticatedIndex();
      return true;
    }
    
    return authenticated;
  }

  /**
   * Maneja el index cuando el usuario ya está autenticado
   */
  function handleAuthenticatedIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    const menuParam = urlParams.get('menu');
    
    const loginDiv = document.getElementById("login");
    if (loginDiv) loginDiv.style.display = "none";
    
    // Mostrar el menú apropiado según el parámetro URL
    if (menuParam === 'actas') {
      NavigationModule.clearDynamicMenus();
      NavigationModule.showActasSelector();
    } else if (menuParam === 'recuperacion') {
      NavigationModule.clearDynamicMenus();
      NavigationModule.showRecuperacionSelector();
    } else {
      NavigationModule.showTypeSelector();
    }
  }

  // API pública del módulo
  return {
    login,
    logout,
    isAuthenticated,
    checkAuthentication
  };

})();

// Exponer funciones globales para compatibilidad con HTML onclick
window.login = AuthModule.login;
window.logout = AuthModule.logout;
