/**
 * Authentication Module
 * Handles user authentication, session management, and access control
 */

const AuthManager = {
    /**
     * Attempt to login user
     * @param {string} userId - User ID
     * @param {string} password - User password
     * @param {string} role - Selected role
     * @returns {Object} Result object with success status and message
     */
    login: function(userId, password, role) {
        console.log('[Auth] Login attempt:', { userId, role });
        
        if (!userId || !password || !role) {
            console.warn('[Auth] Login failed: Missing credentials');
            return { success: false, message: 'Please fill in all fields' };
        }

        const users = StorageManager.getUsers();
        const user = users.find(u => 
            u.id.toLowerCase() === userId.toLowerCase() && 
            u.role === role
        );

        if (!user) {
            console.warn('[Auth] Login failed: User not found');
            return { success: false, message: 'User not found. Please check your ID and role.' };
        }

        if (user.password !== password) {
            console.warn('[Auth] Login failed: Invalid password');
            return { success: false, message: 'Invalid password. Please try again.' };
        }

        if (user.status === 'inactive') {
            console.warn('[Auth] Login failed: Account inactive');
            return { success: false, message: 'Your account is inactive. Please contact administrator.' };
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        StorageManager.setCurrentUser(sessionUser);
        console.log('[Auth] Login successful:', sessionUser.name);

        return { 
            success: true, 
            message: 'Login successful! Redirecting...', 
            user: sessionUser,
            redirectUrl: this.getRedirectUrl(role)
        };
    },

    /**
     * Logout current user
     * @returns {boolean} Success status
     */
    logout: function() {
        const user = StorageManager.getCurrentUser();
        if (user) {
            console.log('[Auth] Logging out user:', user.name);
        }
        StorageManager.clearCurrentUser();
        console.log('[Auth] Logout successful');
        return true;
    },

    /**
     * Check if user is logged in
     * @returns {boolean} Login status
     */
    isLoggedIn: function() {
        const user = StorageManager.getCurrentUser();
        return user !== null;
    },

    /**
     * Get current user
     * @returns {Object|null} Current user or null
     */
    getCurrentUser: function() {
        return StorageManager.getCurrentUser();
    },

    /**
     * Check if current user has specific role
     * @param {string} role - Role to check
     * @returns {boolean} Whether user has the role
     */
    hasRole: function(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    /**
     * Check if current user has any of the specified roles
     * @param {Array} roles - Array of roles to check
     * @returns {boolean} Whether user has any of the roles
     */
    hasAnyRole: function(roles) {
        const user = this.getCurrentUser();
        return user && roles.includes(user.role);
    },

    /**
     * Get redirect URL based on role
     * @param {string} role - User role
     * @returns {string} Redirect URL
     */
    getRedirectUrl: function(role) {
        const redirectMap = {
            'admin': 'admin.html',
            'teacher': 'teacher.html',
            'student': 'student.html'
        };
        return redirectMap[role] || 'login.html';
    },

    /**
     * Protect page - redirect if not logged in or wrong role
     * @param {Array} allowedRoles - Array of allowed roles
     * @returns {boolean} Whether access is allowed
     */
    protectPage: function(allowedRoles) {
        const user = this.getCurrentUser();
        
        if (!user) {
            console.warn('[Auth] Access denied: Not logged in');
            window.location.href = 'login.html';
            return false;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            console.warn('[Auth] Access denied: Insufficient permissions');
            window.location.href = this.getRedirectUrl(user.role);
            return false;
        }

        console.log('[Auth] Access granted for:', user.name);
        return true;
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    validatePassword: function(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        const isValid = password.length >= minLength;
        
        return {
            isValid,
            message: isValid ? 'Password is valid' : `Password must be at least ${minLength} characters`
        };
    },

    /**
     * Change user password
     * @param {string} userId - User ID
     * @param {string} oldPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Object} Result object
     */
    changePassword: function(userId, oldPassword, newPassword) {
        const user = StorageManager.getUserById(userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.password !== oldPassword) {
            return { success: false, message: 'Current password is incorrect' };
        }

        const validation = this.validatePassword(newPassword);
        if (!validation.isValid) {
            return { success: false, message: validation.message };
        }

        const updated = StorageManager.updateUser(userId, { password: newPassword });
        
        if (updated) {
            console.log('[Auth] Password changed for:', userId);
            return { success: true, message: 'Password changed successfully' };
        }

        return { success: false, message: 'Failed to update password' };
    },

    /**
     * Initialize authentication handlers on login page
     */
    initLoginPage: function() {
        console.log('[Auth] Initializing login page...');
        
        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            window.location.href = this.getRedirectUrl(user.role);
            return;
        }

        const loginForm = document.getElementById('loginForm');
        const roleOptions = document.querySelectorAll('.role-option');

        roleOptions.forEach(option => {
            option.addEventListener('click', function() {
                roleOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input').checked = true;
                
                const roleError = document.getElementById('roleError');
                if (roleError) roleError.classList.add('hidden');
            });
        });

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    },

    /**
     * Handle login form submission
     */
    handleLogin: function() {
        const userId = document.getElementById('userId').value.trim();
        const password = document.getElementById('password').value;
        const roleInput = document.querySelector('input[name="role"]:checked');
        
        document.getElementById('roleError')?.classList.add('hidden');
        document.getElementById('userIdError')?.classList.add('hidden');
        document.getElementById('passwordError')?.classList.add('hidden');
        document.getElementById('loginError')?.classList.add('hidden');

        let hasError = false;

        if (!roleInput) {
            document.getElementById('roleError')?.classList.remove('hidden');
            hasError = true;
        }

        if (!userId) {
            document.getElementById('userIdError')?.classList.remove('hidden');
            hasError = true;
        }

        if (!password) {
            document.getElementById('passwordError')?.classList.remove('hidden');
            hasError = true;
        }

        if (hasError) return;

        const role = roleInput.value;
        const result = this.login(userId, password, role);

        if (result.success) {
            if (typeof UI !== 'undefined' && UI.showToast) {
                UI.showToast(result.message, 'success');
            }
            setTimeout(() => {
                window.location.href = result.redirectUrl;
            }, 1000);
        } else {
            document.getElementById('loginError')?.classList.remove('hidden');
            const errorSpan = document.querySelector('#loginError span');
            if (errorSpan) errorSpan.textContent = result.message;
        }
    },

    /**
     * Initialize logout button on dashboard pages
     */
    initLogoutButton: function() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
                window.location.href = 'login.html';
            });
        }
    },

    /**
     * Update user info display on dashboard
     */
    updateUserDisplay: function() {
        const user = this.getCurrentUser();
        if (!user) return;

        const userNameEl = document.getElementById('userName');
        const userAvatarEl = document.getElementById('userAvatar');
        const welcomeEl = document.getElementById('welcomeMessage');

        if (userNameEl) userNameEl.textContent = user.name;
        if (userAvatarEl) userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
        if (welcomeEl) welcomeEl.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }
};
