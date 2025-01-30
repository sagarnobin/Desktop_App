document.addEventListener('DOMContentLoaded', () => {
    console.log('Renderer script loaded and DOM content fully loaded');

    const signupButton = document.getElementById('signupButton');
    const loginButton = document.getElementById('loginButton');
    const updateButton = document.getElementById('updateButton');
    const logoutButton = document.getElementById('logoutButton');
    const deleteButton = document.getElementById('deleteButton');
    const output = document.getElementById('output');

    // Load user details if on profile page
    if (document.getElementById('profile-name')) {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            window.database.getUserById(userId).then(user => {
                if (user) {
                    document.getElementById('profile-name').innerText = user.name;
                    document.getElementById('profile-email').innerText = user.email;
                    document.getElementById('profile-contact').innerText = user.contact_no;

                    // Set placeholders in update box
                    document.getElementById('update-name').value = user.name;
                    document.getElementById('update-email').value = user.email;
                    document.getElementById('update-contact').value = user.contact_no;
                } else {
                    document.getElementById('output').innerText = 'Error loading user details.';
                }
            }).catch(err => {
                console.error('Error loading user details:', err);
                document.getElementById('output').innerText = 'Error loading user details.';
            });
        } else {
            document.getElementById('output').innerText = 'No user logged in.';
        }
    }
    

    if (signupButton) {
        console.log('Adding click event listener to signup button');
        
        signupButton.addEventListener('click', async (e) => {
            // Prevent default form submission if it's in a form
            e.preventDefault();
            
            console.log('Signup button clicked');
            
            // Get and log form values
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('signup-email')?.value;
            const contact = document.getElementById('contact')?.value;
            const password = document.getElementById('signup-password')?.value;
            
            console.log('Form values:', { 
                name: !!name, 
                email: !!email, 
                contact: !!contact, 
                password: !!password 
            });
    
            if (name && email && contact && password) {
                console.log('All fields are filled');
                
                try {
                    console.log('Attempting to create user...');
                   
                    if (!/^[a-zA-Z\s]+$/.test(name)) {
                        output.innerText = 'Error: Name must contain only letters and spaces.';
                        return;
                    }
                    
                    if (!/^\d{11}$/.test(contact)) {
                        output.innerText = 'Error: Contact number must be 11 digits.';
                        return;
                    }
                    if (password.length < 8) {
                        output.innerText = 'Error: Password must be at least 8 characters.';
                        return;
                    }
                    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
                        output.innerText = 'Error: Please enter a valid Gmail address.';
                        return;
                    }
                    
                    const result = await window.database.createUser({ 
                        name, 
                        email, 
                        contact, 
                        password 
                    });
                    
                    console.log('Create user result:', result);
    
                    if (result.success) {
                        console.log('User created successfully');
                        if (output) {
                            output.innerText = `Signup successful! Redirecting to login page...`;
                        }
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        console.error('Error from server:', result.error);
                        if (output) output.innerText = `Error: ${result.error}`;
                    }
                } catch (err) {
                    console.error('Error during signup:', err);
                    if (output) output.innerText = `Error during signup: ${err.message}`;
                }
            } else {
                console.log('Missing required fields');
                if (output) output.innerText = 'Please fill in all fields.';
            }
        });
    } else {
        console.error('Could not find signup button with ID "signupButton"');
    }

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            if (email && password) {
                try {
                    const loginData = { email, password };
                    const result = await window.database.loginUser(loginData);
    
                    if (result.success) {
                        sessionStorage.setItem('userId', result.userId); // Store user ID in session storage
                        output.innerText = 'Login successful! Redirecting...';
                        setTimeout(() => {
                            location.href = 'profile.html'; // Redirect to profile page
                        }, 2000);
                    } else {
                        output.innerText = `Error: ${result.error}`;
                    }
                } catch (err) {
                    console.error('Error during login:', err);
                    output.innerText = `Error: ${err.message}`;
                }
            } else {
                output.innerText = 'Please fill in all fields.';
            }
        });
    } else {
        console.log('Login button not found');
    }

    if (updateButton) {
        console.log('Update button found');
        updateButton.addEventListener('click', async () => {
            const name = document.getElementById('update-name').value;
            const email = document.getElementById('update-email').value;
            const contact = document.getElementById('update-contact').value;

            console.log('Update button clicked', { name, email, contact });

            if (name || email || contact) {
                try {
                    console.log('Invoking update-user IPC event');
                    const userId = sessionStorage.getItem('userId');
                    const userData = { id: userId, name, email, contact };
                    const changes = await window.database.updateUser(userData);
                    console.log('Profile updated successfully', changes);
                    output.innerText = `Profile updated successfully! Refreshing...`;
                    setTimeout(() => {
                        location.reload(); // Refresh the page
                    }, 2000);
                } catch (err) {
                    console.error('Error during profile update:', err);
                    output.innerText = `Error during profile update: ${err.message}`;
                }
            } else {
                output.innerText = 'Please fill in all fields.';
            }
        });
    } else {
        console.log('Update button not found');
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('userId'); // Remove user ID from session storage
            location.href = 'login.html'; // Redirect to login page
        });
    } else {
        console.log('Logout button not found');
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const userId = sessionStorage.getItem('userId');
            if (userId) {
                try {
                    const result = await window.database.deleteUser(userId); // Use window.database
                    if (result.success) {
                        sessionStorage.removeItem('userId'); // Remove user ID from session storage
                        document.getElementById('output').innerText = 'Profile deleted successfully! Redirecting to signup page...';
                        setTimeout(() => {
                            location.href = 'signup.html'; // Redirect to signup page
                        }, 2000);
                    } else {
                        document.getElementById('output').innerText = `Error: ${result.error}`;
                    }
                } catch (err) {
                    console.error('Error during profile deletion:', err);
                    document.getElementById('output').innerText = `Error during profile deletion: ${err.message}`;
                }
            } else {
                document.getElementById('output').innerText = 'No user logged in.';
            }
        });
    } else {
        console.log('Delete button not found');
    }
    
});