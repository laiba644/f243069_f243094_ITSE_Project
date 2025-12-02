/**
 * Storage Module
 * Handles all LocalStorage operations for the Student Portal
 * Provides centralized data management for users, attendance, and results
 */

const StorageManager = {
    KEYS: {
        USERS: 'portal_users',
        ATTENDANCE: 'portal_attendance',
        RESULTS: 'portal_results',
        COURSES: 'portal_courses',
        CURRENT_USER: 'portal_current_user',
        ATTENDANCE_HISTORY: 'portal_attendance_history'
    },

    /**
     * Initialize default data in LocalStorage if not exists
     */
    initializeData: function() {
        console.log('[Storage] Initializing default data...');
       
        if (!this.getData(this.KEYS.USERS)) {
            const defaultUsers = [
                { id: 'ADMIN001', name: 'System Administrator', email: 'admin@portal.edu', password: 'password123', role: 'admin', status: 'active', courses: [], semester: null },
               
                { id: 'TCH001', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@portal.edu', password: 'password123', role: 'teacher', status: 'active', courses: ['CS1002', 'CS2001'], semester: null },
                { id: 'TCH002', name: 'Prof. Michael Chen', email: 'michael.chen@portal.edu', password: 'password123', role: 'teacher', status: 'active', courses: ['MT1003', 'SE1001'], semester: null },
                { id: 'TCH003', name: 'Dr. Emily Davis', email: 'emily.davis@portal.edu', password: 'password123', role: 'teacher', status: 'active', courses: ['CL1000', 'EE2003'], semester: null },
                { id: 'TCH004', name: 'Prof. James Wilson', email: 'james.wilson@portal.edu', password: 'password123', role: 'teacher', status: 'active', courses: ['CS1002', 'SE1001'], semester: null },
               
                { id: 'STU001', name: 'Ahmed Hassan', email: 'ahmed.hassan@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS1002', 'MT1003'], semester: 1 },
                { id: 'STU002', name: 'Maria Garcia', email: 'maria.garcia@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CL1000', 'CS1002'], semester: 1 },
                { id: 'STU003', name: 'John Smith', email: 'john.smith@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['MT1003', 'CL1000'], semester: 1 },
                { id: 'STU004', name: 'Fatima Ali', email: 'fatima.ali@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS1002', 'CL1000'], semester: 1 },
                { id: 'STU005', name: 'David Wilson', email: 'david.wilson@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['MT1003'], semester: 1 },
                { id: 'STU006', name: 'Priya Sharma', email: 'priya.sharma@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CL1000', 'CS1002'], semester: 1 },
                { id: 'STU007', name: 'James Brown', email: 'james.brown@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['MT1003', 'CL1000'], semester: 1 },
                { id: 'STU008', name: 'Aisha Khan', email: 'aisha.khan@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS1002'], semester: 1 },
                { id: 'STU009', name: 'Carlos Rodriguez', email: 'carlos.rodriguez@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CL1000', 'MT1003'], semester: 1 },
                { id: 'STU010', name: 'Sophia Patel', email: 'sophia.patel@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS1002', 'MT1003'], semester: 1 },
                { id: 'STU011', name: 'Hassan Malik', email: 'hassan.malik@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CL1000'], semester: 1 },
                { id: 'STU012', name: 'Isabella Rossi', email: 'isabella.rossi@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['MT1003', 'CS1002'], semester: 1 },
                { id: 'STU013', name: 'Lucas Fernandes', email: 'lucas.fernandes@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CL1000'], semester: 1 },
                { id: 'STU014', name: 'Amira Hassan', email: 'amira.hassan@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS1002', 'CL1000'], semester: 1 },
                { id: 'STU015', name: 'Oliver Thompson', email: 'oliver.thompson@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['MT1003'], semester: 1 },
               
                { id: 'STU016', name: 'Yasmin Ibrahim', email: 'yasmin.ibrahim@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['SE1001', 'CS2001'], semester: 3 },
                { id: 'STU017', name: 'Muhammad Ahmed', email: 'muhammad.ahmed@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS2001', 'EE2003'], semester: 3 },
                { id: 'STU018', name: 'Zainab Khan', email: 'zainab.khan@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['SE1001', 'EE2003'], semester: 3 },
                { id: 'STU019', name: 'Karim Hassan', email: 'karim.hassan@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['SE1001'], semester: 3 },
                { id: 'STU020', name: 'Leila Mostafa', email: 'leila.mostafa@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS2001'], semester: 3 },
                { id: 'STU021', name: 'Nasser Khalil', email: 'nasser.khalil@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['EE2003', 'SE1001'], semester: 3 },
                { id: 'STU022', name: 'Rabia Omar', email: 'rabia.omar@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS2001', 'SE1001'], semester: 3 },
                { id: 'STU023', name: 'Tariq Saleh', email: 'tariq.saleh@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['EE2003'], semester: 3 },
                { id: 'STU024', name: 'Hana Rashid', email: 'hana.rashid@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['SE1001', 'CS2001'], semester: 3 },
                { id: 'STU025', name: 'Samir Hussain', email: 'samir.hussain@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['EE2003', 'CS2001'], semester: 3 },
                { id: 'STU026', name: 'Dina Farrah', email: 'dina.farrah@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['SE1001'], semester: 3 },
                { id: 'STU027', name: 'Adel Nasser', email: 'adel.nasser@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS2001', 'EE2003'], semester: 3 },
                { id: 'STU028', name: 'Noor Mansour', email: 'noor.mansour@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['SE1001', 'EE2003'], semester: 3 },
                { id: 'STU029', name: 'Rami Farah', email: 'rami.farah@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['CS2001'], semester: 3 },
                { id: 'STU030', name: 'Nadia Hassan', email: 'nadia.hassan@student.edu', password: 'password123', role: 'student', status: 'active', courses: ['EE2003', 'SE1001'], semester: 3 }
            ];
            this.setData(this.KEYS.USERS, defaultUsers);
            console.log('[Storage] Default users created:', defaultUsers.length);
        }

        if (!this.getData(this.KEYS.COURSES)) {
            const defaultCourses = [
                { id: 'CL1000', name: 'Introduction to Information and Communication Technology', semester: 1, credits: 3 },
                { id: 'CS1002', name: 'Programming Fundamentals', semester: 1, credits: 4 },
                { id: 'MT1003', name: 'Calculus and Analytical Geometry', semester: 1, credits: 3 },
                { id: 'SE1001', name: 'Introduction to Software Engineering', semester: 3, credits: 3 },
                { id: 'CS2001', name: 'Data Structure', semester: 3, credits: 4 },
                { id: 'EE2003', name: 'Computer Organization and Assembly Language', semester: 3, credits: 3 }
            ];
            this.setData(this.KEYS.COURSES, defaultCourses);
            console.log('[Storage] Default courses created:', defaultCourses.length);
        }

        if (!this.getData(this.KEYS.ATTENDANCE)) {
            const defaultAttendance = {
                'STU001': { present: 18, absent: 2, total: 20, records: [] },
                'STU002': { present: 16, absent: 4, total: 20, records: [] },
                'STU003': { present: 14, absent: 6, total: 20, records: [] },
                'STU004': { present: 19, absent: 1, total: 20, records: [] },
                'STU005': { present: 12, absent: 8, total: 20, records: [] },
                'STU006': { present: 17, absent: 3, total: 20, records: [] },
                'STU007': { present: 15, absent: 5, total: 20, records: [] },
                'STU008': { present: 20, absent: 0, total: 20, records: [] },
                'STU009': { present: 19, absent: 1, total: 20, records: [] },
                'STU010': { present: 16, absent: 4, total: 20, records: [] },
                'STU011': { present: 18, absent: 2, total: 20, records: [] },
                'STU012': { present: 17, absent: 3, total: 20, records: [] },
                'STU013': { present: 14, absent: 6, total: 20, records: [] },
                'STU014': { present: 19, absent: 1, total: 20, records: [] },
                'STU015': { present: 15, absent: 5, total: 20, records: [] },
                'STU016': { present: 18, absent: 2, total: 20, records: [] },
                'STU017': { present: 20, absent: 0, total: 20, records: [] },
                'STU018': { present: 16, absent: 4, total: 20, records: [] },
                'STU019': { present: 19, absent: 1, total: 20, records: [] },
                'STU020': { present: 17, absent: 3, total: 20, records: [] },
                'STU021': { present: 14, absent: 6, total: 20, records: [] },
                'STU022': { present: 18, absent: 2, total: 20, records: [] },
                'STU023': { present: 15, absent: 5, total: 20, records: [] },
                'STU024': { present: 19, absent: 1, total: 20, records: [] },
                'STU025': { present: 16, absent: 4, total: 20, records: [] },
                'STU026': { present: 20, absent: 0, total: 20, records: [] },
                'STU027': { present: 17, absent: 3, total: 20, records: [] },
                'STU028': { present: 18, absent: 2, total: 20, records: [] },
                'STU029': { present: 14, absent: 6, total: 20, records: [] },
                'STU030': { present: 19, absent: 1, total: 20, records: [] }
            };
            this.setData(this.KEYS.ATTENDANCE, defaultAttendance);
            console.log('[Storage] Default attendance created');
        }

        if (!this.getData(this.KEYS.RESULTS)) {
            const defaultResults = [
                { studentId: 'STU001', course: 'CS1002', quiz: 85, assignment: 90, midterm: 78, final: 82, total: 83.3, grade: 'B', uploadedAt: new Date().toISOString() },
                { studentId: 'STU002', course: 'CS1002', quiz: 92, assignment: 88, midterm: 95, final: 90, total: 91.2, grade: 'A', uploadedAt: new Date().toISOString() },
                { studentId: 'STU003', course: 'MT1003', quiz: 70, assignment: 75, midterm: 68, final: 72, total: 71.3, grade: 'C', uploadedAt: new Date().toISOString() },
                { studentId: 'STU004', course: 'CS1002', quiz: 95, assignment: 98, midterm: 92, final: 96, total: 95.3, grade: 'A', uploadedAt: new Date().toISOString() },
                { studentId: 'STU016', course: 'SE1001', quiz: 88, assignment: 92, midterm: 85, final: 89, total: 88.5, grade: 'A', uploadedAt: new Date().toISOString() },
                { studentId: 'STU017', course: 'CS2001', quiz: 80, assignment: 85, midterm: 78, final: 82, total: 81.3, grade: 'B', uploadedAt: new Date().toISOString() }
            ];
            this.setData(this.KEYS.RESULTS, defaultResults);
            console.log('[Storage] Default results created:', defaultResults.length);
        }

        if (!this.getData(this.KEYS.ATTENDANCE_HISTORY)) {
            const today = new Date();
            const defaultHistory = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                defaultHistory.push({
                    date: date.toISOString().split('T')[0],
                    course: 'CS101',
                    present: Math.floor(Math.random() * 3) + 6,
                    absent: Math.floor(Math.random() * 2),
                    total: 8
                });
            }
            this.setData(this.KEYS.ATTENDANCE_HISTORY, defaultHistory);
            console.log('[Storage] Default attendance history created');
        }

        console.log('[Storage] Initialization complete');
    },

    /**
     * Get data from LocalStorage
     * @param {string} key - Storage key
     * @returns {any} Parsed data or null
     */
    getData: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('[Storage] Error reading data:', error);
            return null;
        }
    },

    /**
     * Set data in LocalStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @returns {boolean} Success status
     */
    setData: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log('[Storage] Data saved to:', key);
            return true;
        } catch (error) {
            console.error('[Storage] Error saving data:', error);
            return false;
        }
    },

    /**
     * Get all users
     * @returns {Array} Array of user objects
     */
    getUsers: function() {
        return this.getData(this.KEYS.USERS) || [];
    },

    /**
     * Get users by role
     * @param {string} role - User role (admin, teacher, student)
     * @returns {Array} Filtered array of users
     */
    getUsersByRole: function(role) {
        const users = this.getUsers();
        return role === 'all' ? users : users.filter(u => u.role === role);
    },

    /**
     * Get user by ID
     * @param {string} userId - User ID
     * @returns {Object|null} User object or null
     */
    getUserById: function(userId) {
        const users = this.getUsers();
        return users.find(u => u.id === userId) || null;
    },

    /**
     * Add new user
     * @param {Object} user - User object
     * @returns {boolean} Success status
     */
    addUser: function(user) {
        const users = this.getUsers();
        if (users.find(u => u.id === user.id)) {
            console.warn('[Storage] User ID already exists:', user.id);
            return false;
        }
        users.push(user);
        return this.setData(this.KEYS.USERS, users);
    },

    /**
     * Update user
     * @param {string} userId - User ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} Success status
     */
    updateUser: function(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;
        users[index] = { ...users[index], ...updates };
        return this.setData(this.KEYS.USERS, users);
    },

    /**
     * Delete user
     * @param {string} userId - User ID
     * @returns {boolean} Success status
     */
    deleteUser: function(userId) {
        const users = this.getUsers();
        const filtered = users.filter(u => u.id !== userId);
        return this.setData(this.KEYS.USERS, filtered);
    },

    /**
     * Get all courses
     * @returns {Array} Array of course objects
     */
    getCourses: function() {
        return this.getData(this.KEYS.COURSES) || [];
    },

    /**
     * Get attendance data for a student
     * @param {string} studentId - Student ID
     * @returns {Object} Attendance data
     */
    getStudentAttendance: function(studentId) {
        const attendance = this.getData(this.KEYS.ATTENDANCE) || {};
        return attendance[studentId] || { present: 0, absent: 0, total: 0, records: [] };
    },

    /**
     * Get all attendance data
     * @returns {Object} All attendance data
     */
    getAllAttendance: function() {
        return this.getData(this.KEYS.ATTENDANCE) || {};
    },

    /**
     * Update attendance for a student
     * @param {string} studentId - Student ID
     * @param {Object} attendanceData - Attendance data to update
     * @returns {boolean} Success status
     */
    updateStudentAttendance: function(studentId, attendanceData) {
        const attendance = this.getData(this.KEYS.ATTENDANCE) || {};
        attendance[studentId] = attendanceData;
        return this.setData(this.KEYS.ATTENDANCE, attendance);
    },

    /**
     * Mark attendance for multiple students
     * @param {Array} records - Array of {studentId, status, date, course}
     * @returns {boolean} Success status
     */
    markAttendance: function(records) {
        const attendance = this.getData(this.KEYS.ATTENDANCE) || {};
       
        records.forEach(record => {
            if (!attendance[record.studentId]) {
                attendance[record.studentId] = { present: 0, absent: 0, total: 0, records: [] };
            }
           
            const existingIndex = attendance[record.studentId].records.findIndex(
                r => r.date === record.date && r.course === record.course
            );
           
            if (existingIndex !== -1) {
                const oldStatus = attendance[record.studentId].records[existingIndex].status;
                if (oldStatus === 'present') attendance[record.studentId].present--;
                else attendance[record.studentId].absent--;
               
                attendance[record.studentId].records[existingIndex].status = record.status;
            } else {
                attendance[record.studentId].records.push({
                    date: record.date,
                    course: record.course,
                    status: record.status
                });
                attendance[record.studentId].total++;
            }
           
            if (record.status === 'present') attendance[record.studentId].present++;
            else attendance[record.studentId].absent++;
        });
       
        console.log('[Storage] Attendance marked for', records.length, 'students');
        return this.setData(this.KEYS.ATTENDANCE, attendance);
    },

    /**
     * Get attendance history
     * @returns {Array} Attendance history records
     */
    getAttendanceHistory: function() {
        return this.getData(this.KEYS.ATTENDANCE_HISTORY) || [];
    },

    /**
     * Add attendance history record
     * @param {Object} record - History record
     * @returns {boolean} Success status
     */
    addAttendanceHistory: function(record) {
        const history = this.getAttendanceHistory();
        history.push(record);
        return this.setData(this.KEYS.ATTENDANCE_HISTORY, history);
    },

    /**
     * Get all results
     * @returns {Array} Array of result objects
     */
    getResults: function() {
        return this.getData(this.KEYS.RESULTS) || [];
    },

    /**
     * Get results for a specific student
     * @param {string} studentId - Student ID
     * @returns {Array} Array of student's results
     */
    getStudentResults: function(studentId) {
        const results = this.getResults();
        return results.filter(r => r.studentId === studentId);
    },

    /**
     * Get results for a specific course
     * @param {string} courseFilter - Course to filter by
     * @returns {Array} Array of course results
     */
    getCourseResults: function(courseFilter = 'all') {
        const results = this.getResults();
        return courseFilter === 'all' ? results : results.filter(r => r.course === courseFilter);
    },

    /**
     * Save result
     * @param {Object} result - Result object
     * @returns {boolean} Success status
     */
    saveResult: function(result) {
        const results = this.getResults();
        const existingIndex = results.findIndex(
            r => r.studentId === result.studentId && r.course === result.course
        );

        if (existingIndex !== -1) {
            results[existingIndex] = result;
        } else {
            results.push(result);
        }

        return this.setData(this.KEYS.RESULTS, results);
    },

    /**
     * Delete result
     * @param {string} studentId - Student ID
     * @param {string} course - Course ID
     * @returns {boolean} Success status
     */
    deleteResult: function(studentId, course) {
        const results = this.getResults();
        const filtered = results.filter(r => !(r.studentId === studentId && r.course === course));
        return this.setData(this.KEYS.RESULTS, filtered);
    },

    /**
     * Get current user
     * @returns {Object|null} Current user or null
     */
    getCurrentUser: function() {
        return this.getData(this.KEYS.CURRENT_USER);
    },

    /**
     * Set current user
     * @param {Object} user - User object
     * @returns {boolean} Success status
     */
    setCurrentUser: function(user) {
        return this.setData(this.KEYS.CURRENT_USER, user);
    },

    /**
     * Clear current user
     * @returns {boolean} Success status
     */
    clearCurrentUser: function() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        return true;
    },

    /**
     * Get statistics
     * @returns {Object} Statistics object
     */
    getStatistics: function() {
        const users = this.getUsers();
        const attendance = this.getAllAttendance();
        const results = this.getResults();

        const totalUsers = users.length;
        const totalStudents = users.filter(u => u.role === 'student').length;
        const totalTeachers = users.filter(u => u.role === 'teacher').length;
        const totalCourses = 6;

        let totalAttendance = 0, attendanceCount = 0;
        for (const [studentId, data] of Object.entries(attendance)) {
            if (data.total > 0) {
                totalAttendance += (data.present / data.total) * 100;
                attendanceCount++;
            }
        }
        const avgAttendance = attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0;

        let totalGrades = 0, gradeCount = 0;
        results.forEach(result => {
            totalGrades += result.total;
            gradeCount++;
        });
        const avgGrade = gradeCount > 0 ? Math.round(totalGrades / gradeCount) : 0;

        const lowAttendanceCount = Object.values(attendance).filter(data => {
            if (data.total === 0) return false;
            const percentage = (data.present / data.total) * 100;
            return percentage < 75;
        }).length;

        return {
            totalUsers,
            totalStudents,
            totalTeachers,
            totalCourses,
            avgAttendance,
            avgGrade,
            lowAttendanceCount
        };
    }
};
