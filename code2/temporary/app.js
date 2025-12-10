document.addEventListener('DOMContentLoaded', function() {
    
    // --- OOP CLASS DEFINITION 1: The User Class (The Data Object) ---
    class User {
        constructor(username, email, passwordHash) {
            this.username = username;
            this.email = email;
            this.passwordHash = passwordHash;
            this.dateRegistered = new Date().toISOString();
        }
    }

    // --- OOP CLASS DEFINITION 2: The Manager Class (Encapsulating Storage Logic) ---
    class UserManager {
        constructor(storageKey = 'registeredUsers') {
            this.storageKey = storageKey;
        }

        // Helper: Simple Hash Simulation (NOT secure, for simulation only)
        simpleHash(input) {
            let hash = 0;
            if (input.length === 0) return hash.toString();
            for (let i = 0; i < input.length; i++) {
                const char = input.charCodeAt(i);
                hash = ((hash << 5) - hash) - char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash.toString(16);
        }

        // R - Read operation (Retrieve all users)
        getAllUsers() {
            try {
                const usersJson = localStorage.getItem(this.storageKey);
                return usersJson ? JSON.parse(usersJson) : [];
            } catch (e) {
                console.error("Error reading users from localStorage:", e);
                return [];
            }
        }

        // R - Read operation (Check for existence)
        isEmailRegistered(email) {
            const users = this.getAllUsers();
            return users.some(user => user.email.toLowerCase() === email.toLowerCase());
        }

        // C - Create operation (Add a new user)
        registerUser(username, email, password) {
            if (this.isEmailRegistered(email)) {
                return { success: false, message: 'This email is already registered.' };
            }
            
            const hashedPassword = this.simpleHash(password);
            // Create a new User OBJECT
            const newUser = new User(username, email, hashedPassword);
            
            const users = this.getAllUsers();
            users.push(newUser);
            
            // Save the updated array back to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(users));

           return { success: true, message: `User ${username} successfully registered.` };

        }
    }

    // --- INSTANTIATE THE MANAGER ---


    
    const userManager = new UserManager();

    // --- MODAL & FORM ELEMENTS ---
    const registerModal = document.getElementById('registerModal');
    const registerBtn = document.getElementById('registerBtn');
    const closeBtn = registerModal ? registerModal.querySelector('.close-button') : null;
    const registrationForm = document.getElementById('registrationForm');
    const regMessage = document.getElementById('regMessage');

    // --- MODAL DISPLAY LOGIC ---
    if (registerBtn && registerModal) {
        // Open Modal (Making the Register button clickable)
        registerBtn.addEventListener('click', function() {
            registerModal.style.display = 'block';
            regMessage.textContent = ''; 
            regMessage.style.color = 'green';
        });

        // Close Modal via X button
        if (closeBtn) {
             closeBtn.addEventListener('click', function() {
                registerModal.style.display = 'none';
            });
        }

        // Close Modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === registerModal) {
                registerModal.style.display = 'none';
            }
        });
    }

    // --- FORM SUBMISSION (Using the UserManager class) ---
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            const result = userManager.registerUser(username, email, password);

            if (result.success) {
                regMessage.textContent = result.message;
                regMessage.style.color = 'green';
                registrationForm.reset();
                // Close modal after a short delay for user feedback
                setTimeout(() => registerModal.style.display = 'none', 1500); 
            } else {
                regMessage.textContent = result.message;
                regMessage.style.color = 'red';
            }
        });
    }

    // --- Other Homepage Functionality ---

    // Smooth scroll when clicking 'Start your journey'
    const startSearchBtn = document.getElementById('startSearchBtn');
    if (startSearchBtn) {
        startSearchBtn.addEventListener('click', function() {
            const searchCard = document.querySelector('.search-card');
            if (searchCard) {
                searchCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Set the current year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});