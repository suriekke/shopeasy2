// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn1g7GEbL9zxqRevrdRCCiNkFEd7K52TY",
  authDomain: "shopeasy-app-ebbfb.firebaseapp.com",
  projectId: "shopeasy-app-ebbfb",
  storageBucket: "shopeasy-app-ebbfb.firebasestorage.app",
  messagingSenderId: "974020452029",
  appId: "1:974020452029:web:aff9f28c33412e43f961d4",
  measurementId: "G-MDGNM8CWN8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminName = document.getElementById('adminName');

// Check authentication state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Check if user has admin role
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists && userDoc.data().role === 'admin') {
        showDashboard(user);
      } else {
        await auth.signOut();
        showLogin('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      await auth.signOut();
      showLogin('Error checking permissions.');
    }
  } else {
    showLogin();
  }
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';
  hideError();
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Login error:', error);
    showError('Invalid credentials or insufficient privileges.');
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
});

// Show login screen
function showLogin(errorMessage = '') {
  loginScreen.classList.remove('hidden');
  dashboardScreen.classList.add('hidden');
  
  if (errorMessage) {
    showError(errorMessage);
  }
}

// Show dashboard
function showDashboard(user) {
  loginScreen.classList.add('hidden');
  dashboardScreen.classList.remove('hidden');
  
  adminName.textContent = user.email || 'Admin';
  loginBtn.disabled = false;
  loginBtn.textContent = 'Sign In';
}

// Show error message
function showError(message) {
  loginError.textContent = message;
  loginError.classList.remove('hidden');
}

// Hide error message
function hideError() {
  loginError.classList.add('hidden');
}

// Demo admin credentials (for testing)
// You can create an admin user in Firebase Console with these credentials:
// Email: admin@shopeasy.com
// Password: admin123
// Then add a document in Firestore: /users/{uid} with {role: 'admin'}






