import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';
import { getFirestore, query, where, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCBrjwZqX50L-vhhSQL9TZlJCNQDIEun1c",
    authDomain: "webclinico-92097.firebaseapp.com",
    projectId: "webclinico-92097",
    storageBucket: "webclinico-92097.firebasestorage.app",
    messagingSenderId: "1097682664881",
    appId: "1:1097682664881:web:41553a22a93a8d29985190",
    measurementId: "G-K9DFW93BNR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Manejar el inicio de sesión
const loginForm = document.getElementById('loginForm');
const overlay = document.getElementById('overlay');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Mostrar el spinner
    overlay.style.display = 'flex';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Realizar una consulta para encontrar el correo del usuario por el nombre de usuario
        const usuariosRef = collection(db, 'usuarios');
        const q = query(usuariosRef, where("usuario", "==", username)); // Buscar por el campo 'usuario'

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Obtener el primer documento que coincida
            const userEmail = userDoc.data().correo; // Obtener el correo electrónico del usuario

            // Autenticar con Firebase Authentication utilizando el correo electrónico
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;

            // Verificar si el usuario fue autenticado correctamente
            if (user) {
                // Guardar el ID del documento de Firestore en sessionStorage
                sessionStorage.setItem('userId', userDoc.id);

                // Redirigir a Dashboard.html
                window.location.href = 'Dashboard.html';
            }
        } else {
            alert("Nombre de usuario no encontrado.");
        }
    } catch (error) {
        // Manejo de errores
        console.error("Error durante el inicio de sesión:", error);
        alert("Credenciales incorrectas. Intenta nuevamente.");
    } finally {
        // Ocultar el spinner
        overlay.style.display = 'none';
    }
});