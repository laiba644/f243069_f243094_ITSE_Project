/**
 * UI Module
 * Handles all UI-related operations including toasts, modals, and responsive behaviors
 */

const UI = {
    /**
     * Initialize UI components
     */
    init: function() {
        console.log('[UI] Initializing UI components...');
        this.initSidebar();
        this.initMobileMenu();
        this.initModals();
    },

    /**
     * Initialize sidebar functionality
     */
    initSidebar: function() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('active');
                }
            });
        }

        if (sidebarOverlay && sidebar) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }
    },

    /**
     * Initialize mobile menu
     */
    initMobileMenu: function() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navbarMenu = document.querySelector('.navbar-menu');
       
        if (mobileMenuBtn && navbarMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navbarMenu.classList.toggle('active');
            });
        }
    },

    /**
     * Initialize modal functionality
     */
    initModals: function() {
        const addUserModal = document.getElementById('addUserModal');
        const addUserBtn = document.getElementById('addUserBtn');
        const closeUserModal = document.getElementById('closeUserModal');
        const cancelUserModal = document.getElementById('cancelUserModal');
        const saveUserBtn = document.getElementById('saveUserBtn');
        const newUserRole = document.getElementById('newUserRole');

        if (addUserBtn && addUserModal) {
            addUserBtn.addEventListener('click', () => {
                this.openModal('addUserModal');
            });
        }

        if (closeUserModal) {
            closeUserModal.addEventListener('click', () => {
                this.closeModal('addUserModal');
            });
        }

        if (cancelUserModal) {
            cancelUserModal.addEventListener('click', () => {
                this.closeModal('addUserModal');
            });
        }

        if (saveUserBtn) {
            saveUserBtn.addEventListener('click', () => {
                this.saveNewUser();
            });
        }

        if (newUserRole) {
            newUserRole.addEventListener('change', (e) => {
                this.updateUserFormFields(e.target.value);
            });
        }

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });
    },

    /**
     * Update form fields based on selected role
     */
    updateUserFormFields: function(role) {
        const teacherGroup = document.getElementById('teacherCoursesGroup');
        const studentGroup = document.getElementById('studentSemesterGroup');

        if (teacherGroup) teacherGroup.style.display = role === 'teacher' ? 'block' : 'none';
        if (studentGroup) studentGroup.style.display = role === 'student' ? 'block' : 'none';

        if (role === 'teacher') {
            this.populateTeacherCourses();
        } else if (role === 'student') {
            this.populateStudentCourses();
        }
    },

    /**
     * Populate teacher courses checkboxes
     */
    populateTeacherCourses: function() {
        const container = document.getElementById('teacherCoursesList');
        if (!container) return;

        const teacherCourses = [
            { id: 'CL1000', name: 'CL1000 - Introduction to Information and Communication Technology', semester: 1 },
            { id: 'CS1002', name: 'CS1002 - Programming Fundamentals', semester: 1 },
            { id: 'MT1003', name: 'MT1003 - Calculus and Analytical Geometry', semester: 1 },
            { id: 'SE1001', name: 'SE1001 - Introduction to Software Engineering', semester: 3 },
            { id: 'CS2001', name: 'CS2001 - Data Structure', semester: 3 },
            { id: 'EE2003', name: 'EE2003 - Computer Organization and Assembly Language', semester: 3 }
        ];

        container.innerHTML = teacherCourses.map(course => `
            <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--background-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="checkbox" class="teacherCourseCheckbox" value="${course.id}" style="cursor: pointer;">
                <span>${course.name}</span>
            </label>
        `).join('');
    },

    /**
     * Populate student courses checkboxes based on semester
     */
    populateStudentCourses: function() {
        const container = document.getElementById('studentCoursesList');
        const semesterSelect = document.getElementById('studentSemester');
        if (!container || !semesterSelect) return;

        const semester = semesterSelect.value;
        let courses = [];

        if (semester === '1') {
            courses = [
                { id: 'CL1000', name: 'CL1000 - Introduction to Information and Communication Technology' },
                { id: 'CS1002', name: 'CS1002 - Programming Fundamentals' },
                { id: 'MT1003', name: 'MT1003 - Calculus and Analytical Geometry' }
            ];
        } else if (semester === '3') {
            courses = [
                { id: 'SE1001', name: 'SE1001 - Introduction to Software Engineering' },
                { id: 'CS2001', name: 'CS2001 - Data Structure' },
                { id: 'EE2003', name: 'EE2003 - Computer Organization and Assembly Language' }
            ];
        }

        container.innerHTML = courses.map(course => `
            <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--background-color); border-radius: var(--radius-md); cursor: pointer;">
                <input type="checkbox" class="studentCourseCheckbox" value="${course.id}" style="cursor: pointer;">
                <span>${course.name}</span>
            </label>
        `).join('');
    },

    /**
     * Open modal by ID
     * @param {string} modalId - Modal element ID
     */
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    /**
     * Close modal by ID
     * @param {string} modalId - Modal element ID
     */
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    },

    /**
     * Save new user from modal form
     */
    saveNewUser: function() {
        const role = document.getElementById('newUserRole')?.value;
        const id = document.getElementById('newUserId')?.value.trim();
        const name = document.getElementById('newUserName')?.value.trim();
        const email = document.getElementById('newUserEmail')?.value.trim();
        const password = document.getElementById('newUserPassword')?.value;

        if (!role || !id || !name || !email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (StorageManager.getUserById(id)) {
            this.showToast('User ID already exists', 'error');
            return;
        }

        const newUser = {
            id,
            name,
            email,
            password,
            role,
            status: 'active',
            courses: [],
            semester: null
        };

        // Get selected courses for teacher
        if (role === 'teacher') {
            const teacherCheckboxes = document.querySelectorAll('.teacherCourseCheckbox:checked');
            newUser.courses = Array.from(teacherCheckboxes).map(cb => cb.value);
           
            if (newUser.courses.length === 0) {
                this.showToast('Please assign at least one course to the teacher', 'error');
                return;
            }
        }

        // Get semester and courses for student
        if (role === 'student') {
            const semester = document.getElementById('studentSemester')?.value;
            const studentCheckboxes = document.querySelectorAll('.studentCourseCheckbox:checked');
           
            if (!semester) {
                this.showToast('Please select a semester for the student', 'error');
                return;
            }

            if (studentCheckboxes.length === 0) {
                this.showToast('Please assign at least one course to the student', 'error');
                return;
            }

            newUser.semester = parseInt(semester);
            newUser.courses = Array.from(studentCheckboxes).map(cb => cb.value);
        }

        const success = StorageManager.addUser(newUser);

        if (success) {
            this.showToast('User ${name} added successfully', 'success');
            this.closeModal('addUserModal');
           
            if (typeof AdminDashboard !== 'undefined') {
                AdminDashboard.loadUsers();
                AdminDashboard.updateStats();
            }
        } else {
            this.showToast('Failed to add user', 'error');
        }
    },

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {number} duration - Duration in ms (default 3000)
     */
    showToast: function(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.warn('[UI] Toast container not found');
            return;
        }

        const toast = document.createElement('div');
        toast.className = 'toast ${type}';
       
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };

        toast.innerHTML = `
            <span style="color: var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'}-color);">
                ${icons[type] || icons.info}
            </span>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        console.log('[UI] Toast shown:', message, type);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback on confirm
     * @param {Function} onCancel - Callback on cancel
     */
    showConfirm: function(message, onConfirm, onCancel) {
        const result = confirm(message);
        if (result) {
            if (onConfirm) onConfirm();
        } else {
            if (onCancel) onCancel();
        }
    },

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    formatDate: function(dateString, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
    },

    /**
     * Format time for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted time
     */
    formatTime: function(dateString) {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Scroll to element
     * @param {string} elementId - Element ID to scroll to
     */
    scrollToElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Toggle element visibility
     * @param {string} elementId - Element ID
     */
    toggleVisibility: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle('hidden');
        }
    },

    /**
     * Add loading state to button
     * @param {HTMLElement} button - Button element
     * @param {string} loadingText - Text to show while loading
     */
    setButtonLoading: function(button, loadingText = 'Loading...') {
        if (!button) return;
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `
            <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
            </svg>
            ${loadingText}
        `;
    },

    /**
     * Remove loading state from button
     * @param {HTMLElement} button - Button element
     */
    removeButtonLoading: function(button) {
        if (!button) return;
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }
};

const AdminDashboard = {
    /**
     * Initialize admin dashboard
     */
    init: function() {
        console.log('[AdminDashboard] Initializing...');
        this.loadUsers();
        this.updateStats();
        this.bindEventListeners();
    },

    /**
     * Bind event listeners
     */
    bindEventListeners: function() {
        const filterRole = document.getElementById('filterRole');
        const navDashboard = document.getElementById('navDashboard');
        const navUsers = document.getElementById('navUsers');
        const navCourses = document.getElementById('navCourses');
        const navAttendanceReport = document.getElementById('navAttendanceReport');
        const studentSemesterSelect = document.getElementById('studentSemester');

        if (filterRole) {
            filterRole.addEventListener('change', (e) => {
                this.loadUsers(e.target.value);
            });
        }

        if (navDashboard) {
            navDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('dashboardSection');
                navDashboard.classList.add('active');
                navUsers.classList.remove('active');
                navCourses.classList.remove('active');
                navAttendanceReport.classList.remove('active');
            });
        }

        if (navUsers) {
            navUsers.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('dashboardSection');
                navUsers.classList.add('active');
                navDashboard.classList.remove('active');
                navCourses.classList.remove('active');
                navAttendanceReport.classList.remove('active');
            });
        }

        if (navCourses) {
            navCourses.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('courseManagementSection');
                navCourses.classList.add('active');
                navDashboard.classList.remove('active');
                navUsers.classList.remove('active');
                navAttendanceReport.classList.remove('active');
                this.loadCourses();
            });
        }

        if (navAttendanceReport) {
            navAttendanceReport.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('attendanceReportSection');
                navAttendanceReport.classList.add('active');
                navDashboard.classList.remove('active');
                navUsers.classList.remove('active');
                navCourses.classList.remove('active');
                this.loadAttendanceReport();
            });
        }

        if (studentSemesterSelect) {
            studentSemesterSelect.addEventListener('change', () => {
                UI.populateStudentCourses();
            });
        }
    },

    /**
     * Show section
     */
    showSection: function(sectionId) {
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('courseManagementSection').style.display = 'none';
        document.getElementById('attendanceReportSection').style.display = 'none';
        document.getElementById(sectionId).style.display = 'block';
    },

    /**
     * Load courses table
     */
    loadCourses: function() {
        const tableBody = document.getElementById('coursesTableBody');
        if (!tableBody) return;

        const courses = [
            { id: 'CL1000', name: 'Introduction to Information and Communication Technology', semester: 1 },
            { id: 'CS1002', name: 'Programming Fundamentals', semester: 1 },
            { id: 'MT1003', name: 'Calculus and Analytical Geometry', semester: 1 },
            { id: 'SE1001', name: 'Introduction to Software Engineering', semester: 3 },
            { id: 'CS2001', name: 'Data Structure', semester: 3 },
            { id: 'EE2003', name: 'Computer Organization and Assembly Language', semester: 3 }
        ];

        tableBody.innerHTML = courses.map(course => {
            const teachers = StorageManager.getUsers().filter(u => u.role === 'teacher' && u.courses && u.courses.includes(course.id));
            const students = StorageManager.getUsers().filter(u => u.role === 'student' && u.courses && u.courses.includes(course.id));
           
            return `
                <tr>
                    <td><strong>${course.id}</strong></td>
                    <td>${course.name}</td>
                    <td>Semester ${course.semester}</td>
                    <td>${teachers.length} teacher(s)</td>
                    <td>${students.length} student(s)</td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Load attendance report
     */
    loadAttendanceReport: function() {
        const tableBody = document.getElementById('attendanceReportBody');
        if (!tableBody) return;

        const students = StorageManager.getUsersByRole('student');
        const attendance = StorageManager.getAllAttendance();

        tableBody.innerHTML = students.map(student => {
            const att = attendance[student.id] || { present: 0, absent: 0, total: 0 };
            const percentage = att.total > 0 ? ((att.present / att.total) * 100).toFixed(1) : 0;
            const statusBadge = percentage >= 75 ? 'badge-success' : percentage >= 60 ? 'badge-warning' : 'badge-danger';
            const statusText = percentage >= 75 ? 'Good' : percentage >= 60 ? 'Fair' : 'Low';

            return `
                <tr>
                    <td><strong>${student.id}</strong></td>
                    <td>${student.name}</td>
                    <td>${att.present}</td>
                    <td>${att.absent}</td>
                    <td>${att.total}</td>
                    <td><strong>${percentage}%</strong></td>
                    <td><span class="badge ${statusBadge}">${statusText}</span></td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Load users table
     * @param {string} roleFilter - Role to filter by
     */
    loadUsers: function(roleFilter = 'all') {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        const users = StorageManager.getUsersByRole(roleFilter);

        if (users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 3rem;">
                        <div class="empty-state" style="padding: 0;">
                            <p>No users found.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = users.map(user => {
            const roleBadgeClass = {
                'admin': 'danger',
                'teacher': 'primary',
                'student': 'success'
            }[user.role] || 'info';

            return `
                <tr>
                    <td><strong>${user.id}</strong></td>
                    <td>${user.name}</td>
                    <td><span class="badge badge-${roleBadgeClass}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                    <td>${user.email}</td>
                    <td><span class="badge badge-${user.status === 'active' ? 'success' : 'warning'}">${user.status}</span></td>
                    <td>
                        <div class="flex gap-2">
                            <button class="btn btn-sm btn-secondary" onclick="AdminDashboard.editUser('${user.id}')" title="Edit">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            ${user.role !== 'admin' ? `
                            <button class="btn btn-sm btn-danger" onclick="AdminDashboard.deleteUser('${user.id}')" title="Delete">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Update dashboard statistics
     */
    updateStats: function() {
        const stats = StorageManager.getStatistics();

        const elements = {
            'totalUsers': stats.totalUsers,
            'totalStudents': stats.totalStudents,
            'totalTeachers': stats.totalTeachers,
            'totalCourses': 6
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        }
    },

    /**
     * Edit user
     * @param {string} userId - User ID
     */
    editUser: function(userId) {
        const user = StorageManager.getUserById(userId);
        if (!user) {
            UI.showToast('User not found', 'error');
            return;
        }
       
        UI.showToast('Edit functionality - Coming soon!', 'info');
    },

    /**
     * Delete user
     * @param {string} userId - User ID
     */
    deleteUser: function(userId) {
        const user = StorageManager.getUserById(userId);
        if (!user) {
            UI.showToast('User not found', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete user "${user.name}"?')) {
            const success = StorageManager.deleteUser(userId);
            if (success) {
                UI.showToast('User ${user.name} deleted', 'success');
                this.loadUsers();
                this.updateStats();
            } else {
                UI.showToast('Failed to delete user', 'error');
            }
        }
    }
};
