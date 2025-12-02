/**
 * Results Module
 * Handles all result-related operations including uploading, calculating grades, and viewing
 */

const ResultsManager = {
    GRADE_SCALE: {
        'A': { min: 90, max: 100, gpa: 4.0, description: 'Excellent' },
        'B': { min: 80, max: 89, gpa: 3.0, description: 'Good' },
        'C': { min: 70, max: 79, gpa: 2.0, description: 'Average' },
        'D': { min: 60, max: 69, gpa: 1.0, description: 'Below Average' },
        'F': { min: 0, max: 59, gpa: 0.0, description: 'Fail' }
    },

    WEIGHTS: {
        quiz: 0.20,
        assignment: 0.20,
        midterm: 0.25,
        final: 0.35
    },

    /**
     * Initialize results page for teachers
     */
    initResultsPage: function() {
        console.log('[Results] Initializing results page...');
        
        this.loadStudentDropdown();
        this.loadResultsTable();
        this.bindEventListeners();
    },

    /**
     * Load student dropdown
     */
    loadStudentDropdown: function() {
        const select = document.getElementById('resultStudent');
        if (!select) return;

        const students = StorageManager.getUsersByRole('student');
        
        select.innerHTML = '<option value="">Choose a student...</option>' +
            students.map(student => 
                `<option value="${student.id}">${student.name} (${student.id})</option>`
            ).join('');
    },

    /**
     * Bind event listeners for results page
     */
    bindEventListeners: function() {
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateAndShowResults());
        }

        const resultForm = document.getElementById('resultForm');
        if (resultForm) {
            resultForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveResult();
            });
        }

        const marksInputs = ['quizMarks', 'assignmentMarks', 'midtermMarks', 'finalMarks'];
        marksInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    if (this.areAllMarksEntered()) {
                        this.calculateAndShowResults();
                    }
                });
            }
        });

        const filterCourse = document.getElementById('filterCourse');
        if (filterCourse) {
            filterCourse.addEventListener('change', (e) => {
                this.loadResultsTable(e.target.value);
            });
        }
    },

    /**
     * Check if all marks are entered
     * @returns {boolean}
     */
    areAllMarksEntered: function() {
        const quiz = document.getElementById('quizMarks')?.value;
        const assignment = document.getElementById('assignmentMarks')?.value;
        const midterm = document.getElementById('midtermMarks')?.value;
        const final = document.getElementById('finalMarks')?.value;
        
        return quiz !== '' && assignment !== '' && midterm !== '' && final !== '';
    },

    /**
     * Calculate total marks based on weights
     * @param {Object} marks - Object with quiz, assignment, midterm, final marks
     * @returns {number} Total weighted marks
     */
    calculateTotal: function(marks) {
        return (
            marks.quiz * this.WEIGHTS.quiz +
            marks.assignment * this.WEIGHTS.assignment +
            marks.midterm * this.WEIGHTS.midterm +
            marks.final * this.WEIGHTS.final
        );
    },

    /**
     * Get grade based on total marks
     * @param {number} total - Total marks
     * @returns {string} Grade letter
     */
    getGrade: function(total) {
        for (const [grade, range] of Object.entries(this.GRADE_SCALE)) {
            if (total >= range.min && total <= range.max) {
                return grade;
            }
        }
        return 'F';
    },

    /**
     * Get GPA based on grade
     * @param {string} grade - Grade letter
     * @returns {number} GPA value
     */
    getGPA: function(grade) {
        return this.GRADE_SCALE[grade]?.gpa || 0.0;
    },

    /**
     * Calculate and show results preview
     */
    calculateAndShowResults: function() {
        const quiz = parseFloat(document.getElementById('quizMarks')?.value) || 0;
        const assignment = parseFloat(document.getElementById('assignmentMarks')?.value) || 0;
        const midterm = parseFloat(document.getElementById('midtermMarks')?.value) || 0;
        const final = parseFloat(document.getElementById('finalMarks')?.value) || 0;

        const marks = { quiz, assignment, midterm, final };
        const total = this.calculateTotal(marks);
        const grade = this.getGrade(total);

        const summaryEl = document.getElementById('resultSummary');
        if (summaryEl) {
            summaryEl.style.display = 'block';
            
            document.getElementById('calcQuiz').textContent = `${quiz} × 20% = ${(quiz * this.WEIGHTS.quiz).toFixed(1)}`;
            document.getElementById('calcAssignment').textContent = `${assignment} × 20% = ${(assignment * this.WEIGHTS.assignment).toFixed(1)}`;
            document.getElementById('calcMidterm').textContent = `${midterm} × 25% = ${(midterm * this.WEIGHTS.midterm).toFixed(1)}`;
            document.getElementById('calcFinal').textContent = `${final} × 35% = ${(final * this.WEIGHTS.final).toFixed(1)}`;
            document.getElementById('calcTotal').textContent = `${total.toFixed(1)}/100`;
            
            const gradeEl = document.getElementById('calcGrade');
            if (gradeEl) {
                gradeEl.textContent = grade;
                gradeEl.className = 'grade-display grade-' + grade;
            }
        }

        console.log('[Results] Calculated:', { marks, total: total.toFixed(1), grade });
    },

    /**
     * Save result to storage
     */
    saveResult: function() {
        const studentId = document.getElementById('resultStudent')?.value;
        const course = document.getElementById('resultCourse')?.value;
        const quiz = parseFloat(document.getElementById('quizMarks')?.value) || 0;
        const assignment = parseFloat(document.getElementById('assignmentMarks')?.value) || 0;
        const midterm = parseFloat(document.getElementById('midtermMarks')?.value) || 0;
        const final = parseFloat(document.getElementById('finalMarks')?.value) || 0;

        if (!studentId) {
            UI.showToast('Please select a student', 'error');
            return;
        }

        if (!course) {
            UI.showToast('Please select a course', 'error');
            return;
        }

        const marks = { quiz, assignment, midterm, final };
        const total = this.calculateTotal(marks);
        const grade = this.getGrade(total);

        const result = {
            studentId,
            course,
            quiz,
            assignment,
            midterm,
            final,
            total: parseFloat(total.toFixed(1)),
            grade,
            gpa: this.getGPA(grade),
            uploadedAt: new Date().toISOString()
        };

        const success = StorageManager.saveResult(result);

        if (success) {
            console.log('[Results] Result saved successfully:', result);
            UI.showToast(`Result saved for ${studentId} - Grade: ${grade}`, 'success');
            
            document.getElementById('resultForm')?.reset();
            document.getElementById('resultSummary').style.display = 'none';
            this.loadResultsTable();
        } else {
            UI.showToast('Failed to save result', 'error');
        }
    },

    /**
     * Load results table
     * @param {string} courseFilter - Course to filter by
     */
    loadResultsTable: function(courseFilter = 'all') {
        const tableBody = document.getElementById('resultsTableBody');
        if (!tableBody) return;

        const results = StorageManager.getCourseResults(courseFilter);
        const users = StorageManager.getUsers();

        if (results.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center" style="padding: 3rem;">
                        <div class="empty-state" style="padding: 0;">
                            <p>No results uploaded yet.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const sortedResults = results.sort((a, b) => 
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );

        tableBody.innerHTML = sortedResults.map(result => {
            const student = users.find(u => u.id === result.studentId);
            const studentName = student ? student.name : result.studentId;
            
            return `
                <tr>
                    <td><strong>${studentName}</strong><br><span class="text-small" style="color: var(--text-secondary);">${result.studentId}</span></td>
                    <td>${result.course}</td>
                    <td>${result.quiz}</td>
                    <td>${result.assignment}</td>
                    <td>${result.midterm}</td>
                    <td>${result.final}</td>
                    <td><strong>${result.total}</strong></td>
                    <td><span class="grade-display grade-${result.grade}" style="width: 36px; height: 36px; font-size: 1rem;">${result.grade}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="ResultsManager.deleteResult('${result.studentId}', '${result.course}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        console.log('[Results] Loaded', results.length, 'results');
    },

    /**
     * Delete a result
     * @param {string} studentId - Student ID
     * @param {string} course - Course ID
     */
    deleteResult: function(studentId, course) {
        if (confirm(`Are you sure you want to delete the result for ${studentId} in ${course}?`)) {
            const success = StorageManager.deleteResult(studentId, course);
            if (success) {
                UI.showToast('Result deleted successfully', 'success');
                this.loadResultsTable();
            } else {
                UI.showToast('Failed to delete result', 'error');
            }
        }
    },

    /**
     * Initialize student results view
     */
    initStudentResultsView: function() {
        const user = AuthManager.getCurrentUser();
        if (!user || user.role !== 'student') return;

        const results = StorageManager.getStudentResults(user.id);
        const resultsContainer = document.getElementById('resultsContainer');
        const marksheetContainer = document.getElementById('marksheetContainer');
        const currentGradeEl = document.getElementById('currentGrade');

        if (results.length === 0) {
            if (currentGradeEl) currentGradeEl.textContent = '--';
            return;
        }

        const latestResult = results.sort((a, b) => 
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
        )[0];

        if (currentGradeEl) currentGradeEl.textContent = latestResult.grade;

        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div style="display: grid; gap: 1rem;">
                    ${results.map(result => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--background-color); border-radius: var(--radius-md);">
                            <div>
                                <div style="font-weight: 600;">${result.course}</div>
                                <div class="text-small" style="color: var(--text-secondary);">Total: ${result.total}/100</div>
                            </div>
                            <div class="grade-display grade-${result.grade}">${result.grade}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (marksheetContainer && results.length > 0) {
            this.renderMarksheet(marksheetContainer, user, results);
        }

        console.log('[Results] Student results view initialized:', results.length, 'results');
    },

    /**
     * Render detailed marksheet
     * @param {HTMLElement} container - Container element
     * @param {Object} user - User object
     * @param {Array} results - Array of results
     */
    renderMarksheet: function(container, user, results) {
        const today = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        const overallGPA = results.length > 0 
            ? (results.reduce((sum, r) => sum + this.getGPA(r.grade), 0) / results.length).toFixed(2)
            : '0.00';

        const overallGrade = this.getGrade(
            results.reduce((sum, r) => sum + r.total, 0) / results.length
        );

        container.innerHTML = `
            <div class="marksheet">
                <div class="marksheet-header">
                    <h2>Academic Result Report</h2>
                    <p>Student Attendance & Result Portal</p>
                </div>
                <div class="marksheet-body">
                    <div class="marksheet-info">
                        <div class="info-item">
                            <span class="info-label">Student Name</span>
                            <span class="info-value">${user.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Student ID</span>
                            <span class="info-value">${user.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value">${user.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Report Date</span>
                            <span class="info-value">${today}</span>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Quiz (20%)</th>
                                    <th>Assignment (20%)</th>
                                    <th>Midterm (25%)</th>
                                    <th>Final (35%)</th>
                                    <th>Total</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.map(result => `
                                    <tr>
                                        <td><strong>${result.course}</strong></td>
                                        <td>${result.quiz}</td>
                                        <td>${result.assignment}</td>
                                        <td>${result.midterm}</td>
                                        <td>${result.final}</td>
                                        <td><strong>${result.total}</strong></td>
                                        <td><span class="badge badge-${result.grade === 'A' ? 'success' : result.grade === 'B' ? 'primary' : result.grade === 'F' ? 'danger' : 'warning'}">${result.grade}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="marksheet-footer">
                    <div class="overall-grade">
                        <span style="color: var(--text-secondary);">Overall Performance:</span>
                        <div class="grade-display grade-${overallGrade}">${overallGrade}</div>
                        <span style="font-weight: 600;">GPA: ${overallGPA}</span>
                    </div>
                    <div class="text-small" style="color: var(--text-secondary);">
                        Generated on ${today}
                    </div>
                </div>
            </div>
        `;

        const printBtn = document.getElementById('printMarksheet');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
};
