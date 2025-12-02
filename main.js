/**
 * Main Application Module
 * Entry point for the Student Attendance & Result Portal
 * Handles page routing and initialization
 */

const App = {
    /**
     * Initialize the application
     */
    init: function() {
        console.log('[App] Student Attendance & Result Portal initializing...');
        
        const currentPage = this.getCurrentPage();
        console.log('[App] Current page:', currentPage);

        UI.init();

        switch (currentPage) {
            case 'index.html':
            case '':
                this.initHomePage();
                break;
            case 'login.html':
                this.initLoginPage();
                break;
            case 'admin.html':
                this.initAdminPage();
                break;
            case 'teacher.html':
                this.initTeacherPage();
                break;
            case 'student.html':
                this.initStudentPage();
                break;
            case 'attendance.html':
                this.initAttendancePage();
                break;
            case 'results.html':
                this.initResultsPage();
                break;
            default:
                console.log('[App] Unknown page:', currentPage);
        }

        console.log('[App] Initialization complete');
    },

    /**
     * Get current page name from URL
     * @returns {string} Page name
     */
    getCurrentPage: function() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);
        return page || 'index.html';
    },

    /**
     * Initialize home page
     */
    initHomePage: function() {
        console.log('[App] Initializing home page...');
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    },

    /**
     * Initialize login page
     */
    initLoginPage: function() {
        console.log('[App] Initializing login page...');
        AuthManager.initLoginPage();
    },

    /**
     * Initialize admin dashboard page
     */
    initAdminPage: function() {
        console.log('[App] Initializing admin page...');
        
        if (!AuthManager.protectPage(['admin'])) return;

        AuthManager.initLogoutButton();
        AuthManager.updateUserDisplay();
        AdminDashboard.init();
    },

    /**
     * Initialize teacher dashboard page
     */
    initTeacherPage: function() {
        console.log('[App] Initializing teacher page...');
        
        if (!AuthManager.protectPage(['teacher', 'admin'])) return;

        AuthManager.initLogoutButton();
        AuthManager.updateUserDisplay();
        AttendanceManager.initTeacherDashboard();
    },

    /**
     * Initialize student dashboard page
     */
    initStudentPage: function() {
        console.log('[App] Initializing student page...');
        
        if (!AuthManager.protectPage(['student'])) return;

        AuthManager.initLogoutButton();
        AuthManager.updateUserDisplay();
        AttendanceManager.initStudentAttendanceView();
        ResultsManager.initStudentResultsView();
    },

    /**
     * Initialize attendance page
     */
    initAttendancePage: function() {
        console.log('[App] Initializing attendance page...');
        
        if (!AuthManager.protectPage(['teacher', 'admin'])) return;

        AuthManager.initLogoutButton();
        AuthManager.updateUserDisplay();
        AttendanceManager.initAttendancePage();
    },

    /**
     * Initialize results page
     */
    initResultsPage: function() {
        console.log('[App] Initializing results page...');
        
        if (!AuthManager.protectPage(['teacher', 'admin'])) return;

        AuthManager.initLogoutButton();
        AuthManager.updateUserDisplay();
        ResultsManager.initResultsPage();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

window.App = App;
window.StorageManager = StorageManager;
window.AuthManager = AuthManager;
window.AttendanceManager = AttendanceManager;
window.ResultsManager = ResultsManager;
window.UI = UI;
window.AdminDashboard = AdminDashboard;
