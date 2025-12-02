/**
 * Attendance Module
 * Handles all attendance-related operations including marking, viewing, and calculating
 */

const AttendanceManager = {
    currentAttendance: {},

    /**
     * Initialize attendance page for teachers
     */
    initAttendancePage: function() {
        console.log('[Attendance] Initializing attendance page...');
        
        const dateInput = document.getElementById('attendanceDate');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }

        this.loadStudentsForAttendance();
        this.loadAttendanceHistory();
        this.bindEventListeners();
    },

    /**
     * Load students for attendance marking
     */
    loadStudentsForAttendance: function() {
        const students = StorageManager.getUsersByRole('student');
        const tableBody = document.getElementById('attendanceTableBody');
        
        if (!tableBody) return;

        if (students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 3rem;">
                        <div class="empty-state" style="padding: 0;">
                            <p>No students found in the system.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const attendance = StorageManager.getAllAttendance();
        
        tableBody.innerHTML = students.map(student => {
            const att = attendance[student.id] || { present: 0, absent: 0, total: 0 };
            const percentage = att.total > 0 ? ((att.present / att.total) * 100).toFixed(1) : 0;
            const progressClass = percentage >= 75 ? 'success' : percentage >= 60 ? 'warning' : 'danger';
            
            this.currentAttendance[student.id] = 'present';
            
            return `
                <tr data-student-id="${student.id}">
                    <td>
                        <input type="checkbox" class="attendance-checkbox student-attendance" 
                               data-student-id="${student.id}" checked>
                    </td>
                    <td><strong>${student.id}</strong></td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>
                        <div class="attendance-status">
                            <span class="status-dot present" data-student-id="${student.id}"></span>
                            <span class="status-text" data-student-id="${student.id}">Present</span>
                        </div>
                    </td>
                    <td>
                        <div class="flex items-center gap-2">
                            <div class="progress" style="width: 100px; height: 6px;">
                                <div class="progress-bar ${progressClass}" style="width: ${percentage}%;"></div>
                            </div>
                            <span class="text-small">${percentage}%</span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        this.updateAttendanceSummary();
        console.log('[Attendance] Loaded', students.length, 'students');
    },

    /**
     * Bind event listeners for attendance page
     */
    bindEventListeners: function() {
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.student-attendance');
                checkboxes.forEach(cb => {
                    cb.checked = e.target.checked;
                    this.updateStudentStatus(cb.dataset.studentId, e.target.checked);
                });
                this.updateAttendanceSummary();
            });
        }

        document.querySelectorAll('.student-attendance').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateStudentStatus(e.target.dataset.studentId, e.target.checked);
                this.updateAttendanceSummary();
            });
        });

        const markAllPresent = document.getElementById('markAllPresent');
        if (markAllPresent) {
            markAllPresent.addEventListener('click', () => {
                document.querySelectorAll('.student-attendance').forEach(cb => {
                    cb.checked = true;
                    this.updateStudentStatus(cb.dataset.studentId, true);
                });
                document.getElementById('selectAll').checked = true;
                this.updateAttendanceSummary();
                UI.showToast('All students marked as present', 'success');
            });
        }

        const markAllAbsent = document.getElementById('markAllAbsent');
        if (markAllAbsent) {
            markAllAbsent.addEventListener('click', () => {
                document.querySelectorAll('.student-attendance').forEach(cb => {
                    cb.checked = false;
                    this.updateStudentStatus(cb.dataset.studentId, false);
                });
                document.getElementById('selectAll').checked = false;
                this.updateAttendanceSummary();
                UI.showToast('All students marked as absent', 'warning');
            });
        }

        const saveBtn = document.getElementById('saveAttendanceBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAttendance());
        }

        const loadBtn = document.getElementById('loadStudentsBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadStudentsForAttendance();
                UI.showToast('Students loaded successfully', 'info');
            });
        }
    },

    /**
     * Update student attendance status display
     * @param {string} studentId - Student ID
     * @param {boolean} isPresent - Presence status
     */
    updateStudentStatus: function(studentId, isPresent) {
        this.currentAttendance[studentId] = isPresent ? 'present' : 'absent';
        
        const statusDot = document.querySelector(`.status-dot[data-student-id="${studentId}"]`);
        const statusText = document.querySelector(`.status-text[data-student-id="${studentId}"]`);
        
        if (statusDot) {
            statusDot.classList.remove('present', 'absent');
            statusDot.classList.add(isPresent ? 'present' : 'absent');
        }
        
        if (statusText) {
            statusText.textContent = isPresent ? 'Present' : 'Absent';
        }
    },

    /**
     * Update attendance summary badge
     */
    updateAttendanceSummary: function() {
        const present = Object.values(this.currentAttendance).filter(s => s === 'present').length;
        const absent = Object.values(this.currentAttendance).filter(s => s === 'absent').length;
        
        const summary = document.getElementById('attendanceSummary');
        if (summary) {
            summary.textContent = `${present} Present | ${absent} Absent`;
        }
    },

    /**
     * Save attendance records
     */
    saveAttendance: function() {
        const dateInput = document.getElementById('attendanceDate');
        const courseSelect = document.getElementById('courseSelect');
        
        if (!dateInput || !courseSelect) {
            UI.showToast('Error: Form elements not found', 'error');
            return;
        }

        const date = dateInput.value;
        const course = courseSelect.value;

        if (!date) {
            UI.showToast('Please select a date', 'error');
            return;
        }

        const records = [];
        for (const [studentId, status] of Object.entries(this.currentAttendance)) {
            records.push({
                studentId,
                status,
                date,
                course
            });
        }

        const success = StorageManager.markAttendance(records);
        
        if (success) {
            const present = records.filter(r => r.status === 'present').length;
            const absent = records.filter(r => r.status === 'absent').length;
            
            StorageManager.addAttendanceHistory({
                date,
                course,
                present,
                absent,
                total: records.length
            });
            
            this.loadStudentsForAttendance();
            this.loadAttendanceHistory();
            
            console.log('[Attendance] Saved attendance for', records.length, 'students');
            UI.showToast(`Attendance saved! ${present} present, ${absent} absent`, 'success');
        } else {
            UI.showToast('Failed to save attendance', 'error');
        }
    },

    /**
     * Load attendance history
     */
    loadAttendanceHistory: function() {
        const tableBody = document.getElementById('historyTableBody');
        if (!tableBody) return;

        const history = StorageManager.getAttendanceHistory();
        
        if (history.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center" style="padding: 2rem;">
                        No attendance history available.
                    </td>
                </tr>
            `;
            return;
        }

        const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        tableBody.innerHTML = sortedHistory.map(record => {
            const percentage = record.total > 0 
                ? ((record.present / record.total) * 100).toFixed(1) 
                : 0;
            const badgeClass = percentage >= 75 ? 'success' : percentage >= 60 ? 'warning' : 'danger';
            
            return `
                <tr>
                    <td>${this.formatDate(record.date)}</td>
                    <td>${record.course}</td>
                    <td><span class="badge badge-success">${record.present}</span></td>
                    <td><span class="badge badge-danger">${record.absent}</span></td>
                    <td><span class="badge badge-${badgeClass}">${percentage}%</span></td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Get student attendance summary
     * @param {string} studentId - Student ID
     * @returns {Object} Attendance summary
     */
    getStudentAttendanceSummary: function(studentId) {
        const attendance = StorageManager.getStudentAttendance(studentId);
        const percentage = attendance.total > 0 
            ? ((attendance.present / attendance.total) * 100).toFixed(1) 
            : 0;
        
        return {
            present: attendance.present,
            absent: attendance.absent,
            total: attendance.total,
            percentage: parseFloat(percentage),
            isLow: percentage < 75
        };
    },

    /**
     * Get students with low attendance
     * @param {number} threshold - Percentage threshold (default 75)
     * @returns {Array} Array of students with low attendance
     */
    getLowAttendanceStudents: function(threshold = 75) {
        const students = StorageManager.getUsersByRole('student');
        const attendance = StorageManager.getAllAttendance();
        
        return students.filter(student => {
            const att = attendance[student.id];
            if (!att || att.total === 0) return false;
            const percentage = (att.present / att.total) * 100;
            return percentage < threshold;
        }).map(student => {
            const att = attendance[student.id];
            return {
                ...student,
                attendance: att,
                percentage: ((att.present / att.total) * 100).toFixed(1)
            };
        });
    },

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate: function(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    /**
     * Initialize student attendance view
     */
    initStudentAttendanceView: function() {
        const user = AuthManager.getCurrentUser();
        if (!user || user.role !== 'student') return;

        const summary = this.getStudentAttendanceSummary(user.id);
        
        const myAttendancePercent = document.getElementById('myAttendancePercent');
        const daysPresent = document.getElementById('daysPresent');
        const daysAbsent = document.getElementById('daysAbsent');
        const attendanceAlert = document.getElementById('attendanceAlert');
        const progressBar = document.getElementById('attendanceProgressBar');
        const progressText = document.getElementById('attendanceProgressText');
        const presentDisplay = document.getElementById('presentCountDisplay');
        const absentDisplay = document.getElementById('absentCountDisplay');

        if (myAttendancePercent) myAttendancePercent.textContent = `${summary.percentage}%`;
        if (daysPresent) daysPresent.textContent = summary.present;
        if (daysAbsent) daysAbsent.textContent = summary.absent;
        if (presentDisplay) presentDisplay.textContent = summary.present;
        if (absentDisplay) absentDisplay.textContent = summary.absent;
        
        if (progressBar) {
            progressBar.style.width = `${summary.percentage}%`;
            progressBar.className = 'progress-bar';
            if (summary.percentage >= 75) progressBar.classList.add('success');
            else if (summary.percentage >= 60) progressBar.classList.add('warning');
            else progressBar.classList.add('danger');
        }
        
        if (progressText) progressText.textContent = `${summary.percentage}%`;
        
        if (attendanceAlert) {
            if (summary.isLow) {
                attendanceAlert.classList.remove('hidden');
            } else {
                attendanceAlert.classList.add('hidden');
            }
        }

        console.log('[Attendance] Student attendance view initialized:', summary);
    },

    /**
     * Initialize teacher dashboard attendance stats
     */
    initTeacherDashboard: function() {
        const students = StorageManager.getUsersByRole('student');
        const attendance = StorageManager.getAllAttendance();
        const results = StorageManager.getResults();
        
        const myStudentsEl = document.getElementById('myStudents');
        const todayAttendanceEl = document.getElementById('todayAttendance');
        const lowAttendanceEl = document.getElementById('lowAttendanceStudents');
        const resultsUploadedEl = document.getElementById('resultsUploaded');
        const alertCountEl = document.getElementById('alertCount');
        const alertsContainer = document.getElementById('alertsContainer');

        if (myStudentsEl) myStudentsEl.textContent = students.length;
        if (resultsUploadedEl) resultsUploadedEl.textContent = results.length;

        let presentToday = 0;
        let totalToday = 0;
        const lowAttendanceStudents = [];

        students.forEach(student => {
            const att = attendance[student.id];
            if (att && att.total > 0) {
                totalToday++;
                const percentage = (att.present / att.total) * 100;
                if (percentage < 75) {
                    lowAttendanceStudents.push({
                        ...student,
                        percentage: percentage.toFixed(1)
                    });
                }
                if (att.records && att.records.length > 0) {
                    const today = new Date().toISOString().split('T')[0];
                    const todayRecord = att.records.find(r => r.date === today);
                    if (todayRecord && todayRecord.status === 'present') {
                        presentToday++;
                    }
                }
            }
        });

        if (todayAttendanceEl) {
            const todayPercentage = totalToday > 0 ? ((presentToday / totalToday) * 100).toFixed(0) : 0;
            todayAttendanceEl.textContent = `${todayPercentage}%`;
        }

        if (lowAttendanceEl) lowAttendanceEl.textContent = lowAttendanceStudents.length;
        if (alertCountEl) alertCountEl.textContent = `${lowAttendanceStudents.length} Students`;

        if (alertsContainer) {
            if (lowAttendanceStudents.length > 0) {
                alertsContainer.innerHTML = lowAttendanceStudents.slice(0, 5).map(student => `
                    <div class="alert alert-warning" style="margin-bottom: 0.75rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <div>
                            <strong>${student.name}</strong>
                            <p style="margin: 0; font-size: 0.8125rem;">Attendance: ${student.percentage}% (Below 75% threshold)</p>
                        </div>
                    </div>
                `).join('');
            }
        }

        this.loadTeacherStudentTable(students, attendance, results);
    },

    /**
     * Load student table for teacher dashboard
     */
    loadTeacherStudentTable: function(students, attendance, results) {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        if (students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center" style="padding: 2rem;">
                        No students found.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = students.map(student => {
            const att = attendance[student.id] || { present: 0, total: 0 };
            const percentage = att.total > 0 ? ((att.present / att.total) * 100).toFixed(1) : 0;
            const studentResult = results.find(r => r.studentId === student.id);
            const grade = studentResult ? studentResult.grade : '--';
            
            const statusClass = percentage >= 75 ? 'success' : percentage >= 60 ? 'warning' : 'danger';
            const statusText = percentage >= 75 ? 'Good' : percentage >= 60 ? 'At Risk' : 'Critical';
            
            return `
                <tr>
                    <td><strong>${student.id}</strong></td>
                    <td>${student.name}</td>
                    <td>
                        <div class="flex items-center gap-2">
                            <div class="progress" style="width: 80px; height: 6px;">
                                <div class="progress-bar ${statusClass}" style="width: ${percentage}%;"></div>
                            </div>
                            <span class="text-small">${percentage}%</span>
                        </div>
                    </td>
                    <td><span class="badge badge-${grade === 'A' ? 'success' : grade === 'B' ? 'primary' : grade === 'F' ? 'danger' : 'info'}">${grade}</span></td>
                    <td><span class="badge badge-${statusClass}">${statusText}</span></td>
                </tr>
            `;
        }).join('');
    }
};
