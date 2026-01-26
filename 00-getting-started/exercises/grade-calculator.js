/**
 * Professional Grade Calculator System
 * Comprehensive academic performance analysis tool with GPA calculation,
 * grade prediction, and detailed reporting capabilities.
 * 
 * @version 2.0.0
 * @author Solomon Kassa
 * @license MIT
 */

class GradeCalculator {
    constructor(config = {}) {
        // Configuration defaults
        this.config = {
            gradingScale: config.gradingScale || 'standard', // 'standard', 'weighted', 'custom'
            decimalPlaces: config.decimalPlaces || 2,
            maxScore: config.maxScore || 100,
            passThreshold: config.passThreshold || 40,
            enableCurve: config.enableCurve || false,
            curveFactor: config.curveFactor || 0,
            autoSave: config.autoSave || true,
            language: config.language || 'en',
            ...config
        };

        // Grading systems
        this.gradingSystems = {
            'standard': {
                name: 'Standard 4.0 Scale',
                scale: [
                    { grade: 'A+', min: 97, max: 100, points: 4.0, description: 'Excellent' },
                    { grade: 'A', min: 93, max: 96.9, points: 4.0, description: 'Excellent' },
                    { grade: 'A-', min: 90, max: 92.9, points: 3.7, description: 'Excellent' },
                    { grade: 'B+', min: 87, max: 89.9, points: 3.3, description: 'Good' },
                    { grade: 'B', min: 83, max: 86.9, points: 3.0, description: 'Good' },
                    { grade: 'B-', min: 80, max: 82.9, points: 2.7, description: 'Good' },
                    { grade: 'C+', min: 77, max: 79.9, points: 2.3, description: 'Average' },
                    { grade: 'C', min: 73, max: 76.9, points: 2.0, description: 'Average' },
                    { grade: 'C-', min: 70, max: 72.9, points: 1.7, description: 'Average' },
                    { grade: 'D+', min: 67, max: 69.9, points: 1.3, description: 'Below Average' },
                    { grade: 'D', min: 65, max: 66.9, points: 1.0, description: 'Below Average' },
                    { grade: 'F', min: 0, max: 64.9, points: 0.0, description: 'Fail' }
                ]
            },
            'weighted': {
                name: 'Weighted GPA Scale (AP/Honors)',
                scale: [
                    { grade: 'A+', min: 97, max: 100, points: 5.0, description: 'Advanced Excellent' },
                    { grade: 'A', min: 93, max: 96.9, points: 5.0, description: 'Advanced Excellent' },
                    { grade: 'A-', min: 90, max: 92.9, points: 4.7, description: 'Advanced Excellent' },
                    { grade: 'B+', min: 87, max: 89.9, points: 4.3, description: 'Advanced Good' },
                    { grade: 'B', min: 83, max: 86.9, points: 4.0, description: 'Advanced Good' },
                    { grade: 'B-', min: 80, max: 82.9, points: 3.7, description: 'Advanced Good' },
                    { grade: 'C+', min: 77, max: 79.9, points: 3.3, description: 'Advanced Average' },
                    { grade: 'C', min: 73, max: 76.9, points: 3.0, description: 'Advanced Average' },
                    { grade: 'C-', min: 70, max: 72.9, points: 2.7, description: 'Advanced Average' },
                    { grade: 'D+', min: 67, max: 69.9, points: 2.3, description: 'Advanced Below Average' },
                    { grade: 'D', min: 65, max: 66.9, points: 2.0, description: 'Advanced Below Average' },
                    { grade: 'F', min: 0, max: 64.9, points: 0.0, description: 'Fail' }
                ]
            },
            'uk': {
                name: 'UK University Scale',
                scale: [
                    { grade: 'First', min: 70, max: 100, points: 4.0, description: 'First Class Honours' },
                    { grade: '2:1', min: 60, max: 69.9, points: 3.3, description: 'Upper Second Class' },
                    { grade: '2:2', min: 50, max: 59.9, points: 2.7, description: 'Lower Second Class' },
                    { grade: 'Third', min: 40, max: 49.9, points: 2.0, description: 'Third Class' },
                    { grade: 'Fail', min: 0, max: 39.9, points: 0.0, description: 'Fail' }
                ]
            },
            'european': {
                name: 'European ECTS Scale',
                scale: [
                    { grade: 'A', min: 90, max: 100, points: 4.0, description: 'Excellent' },
                    { grade: 'B', min: 80, max: 89.9, points: 3.5, description: 'Very Good' },
                    { grade: 'C', min: 70, max: 79.9, points: 3.0, description: 'Good' },
                    { grade: 'D', min: 60, max: 69.9, points: 2.5, description: 'Satisfactory' },
                    { grade: 'E', min: 50, max: 59.9, points: 2.0, description: 'Sufficient' },
                    { grade: 'F', min: 0, max: 49.9, points: 0.0, description: 'Fail' }
                ]
            }
        };

        // Student data storage
        this.students = new Map();
        this.courses = new Map();
        this.history = [];
        this.sessionId = this.generateSessionId();

        // Statistics
        this.statistics = {
            totalCalculations: 0,
            totalStudents: 0,
            averageGPA: 0,
            highestGPA: 0,
            lowestGPA: 4.0
        };

        this.initialize();
    }

    /**
     * Initialize the grade calculator
     * @private
     */
    initialize() {
        console.log(`📚 Grade Calculator v${this.config.version || '2.0.0'} initialized`);
        console.log(`📊 Grading System: ${this.gradingSystems[this.config.gradingScale].name}`);
        console.log(`🎯 Pass Threshold: ${this.config.passThreshold}%`);
        
        // Load saved data if available
        this.loadFromStorage();
    }

    /**
     * Generate unique session ID
     * @private
     */
    generateSessionId() {
        return 'GC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Calculate grade for a single score
     * @param {number} score - The score obtained
     * @param {Object} options - Calculation options
     * @returns {Object} Grade information
     */
    calculateGrade(score, options = {}) {
        const {
            applyCurve = this.config.enableCurve,
            curveAmount = this.config.curveFactor,
            maxScore = this.config.maxScore,
            customScale = null
        } = options;

        // Validate input
        if (typeof score !== 'number' || isNaN(score)) {
            throw new Error('Invalid score: must be a number');
        }

        if (score < 0 || score > maxScore) {
            throw new Error(`Score must be between 0 and ${maxScore}`);
        }

        // Apply curve if enabled
        let adjustedScore = score;
        if (applyCurve && curveAmount > 0) {
            adjustedScore = this.applyCurve(score, curveAmount, maxScore);
        }

        // Calculate percentage
        const percentage = (adjustedScore / maxScore) * 100;

        // Get appropriate grading scale
        const scale = customScale || this.gradingSystems[this.config.gradingScale].scale;

        // Find matching grade
        let gradeInfo = null;
        for (const grade of scale) {
            if (percentage >= grade.min && percentage <= grade.max) {
                gradeInfo = { ...grade };
                gradeInfo.percentage = this.round(percentage);
                gradeInfo.score = this.round(adjustedScore);
                gradeInfo.rawScore = this.round(score);
                gradeInfo.maxScore = maxScore;
                gradeInfo.isPassing = percentage >= this.config.passThreshold;
                break;
            }
        }

        if (!gradeInfo) {
            throw new Error('No matching grade found for the given score');
        }

        // Update statistics
        this.statistics.totalCalculations++;
        this.updateStatistics(gradeInfo.points);

        // Record in history
        this.recordCalculation({
            type: 'grade_calculation',
            score: score,
            adjustedScore: adjustedScore,
            percentage: percentage,
            grade: gradeInfo.grade,
            points: gradeInfo.points,
            timestamp: new Date().toISOString()
        });

        return gradeInfo;
    }

    /**
     * Apply curve to score
     * @private
     */
    applyCurve(score, curveAmount, maxScore) {
        const curveType = typeof curveAmount === 'object' ? curveAmount.type : 'linear';
        const amount = typeof curveAmount === 'object' ? curveAmount.amount : curveAmount;

        switch (curveType) {
            case 'linear':
                return Math.min(score + amount, maxScore);
            case 'percentage':
                return Math.min(score * (1 + amount / 100), maxScore);
            case 'sqrt':
                // Square root curve: sqrt(score) * sqrt(maxScore)
                return Math.sqrt(score) * Math.sqrt(maxScore);
            case 'custom':
                // Custom curve function
                if (typeof amount === 'function') {
                    return amount(score, maxScore);
                }
                return score;
            default:
                return score;
        }
    }

    /**
     * Register a new student
     * @param {Object} studentInfo - Student information
     * @returns {string} Student ID
     */
    registerStudent(studentInfo) {
        const requiredFields = ['firstName', 'lastName', 'id'];
        for (const field of requiredFields) {
            if (!studentInfo[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const studentId = studentInfo.id || this.generateStudentId();
        const student = {
            id: studentId,
            firstName: studentInfo.firstName,
            lastName: studentInfo.lastName,
            email: studentInfo.email || '',
            program: studentInfo.program || 'General',
            enrollmentDate: studentInfo.enrollmentDate || new Date().toISOString(),
            status: 'active',
            courses: [],
            cumulativeGPA: 0,
            totalCredits: 0,
            totalPoints: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.students.set(studentId, student);
        this.statistics.totalStudents++;

        this.recordCalculation({
            type: 'student_registration',
            studentId: studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            timestamp: new Date().toISOString()
        });

        if (this.config.autoSave) {
            this.saveToStorage();
        }

        return studentId;
    }

    /**
     * Generate unique student ID
     * @private
     */
    generateStudentId() {
        const year = new Date().getFullYear().toString().substr(-2);
        const sequence = (this.students.size + 1).toString().padStart(4, '0');
        return `STU${year}${sequence}`;
    }

    /**
     * Add a course for a student
     * @param {string} studentId - Student ID
     * @param {Object} courseInfo - Course information
     * @returns {Object} Course record
     */
    addCourse(studentId, courseInfo) {
        const student = this.students.get(studentId);
        if (!student) {
            throw new Error(`Student not found: ${studentId}`);
        }

        const courseCode = courseInfo.code || this.generateCourseCode();
        const course = {
            code: courseCode,
            name: courseInfo.name || 'Unnamed Course',
            credits: courseInfo.credits || 3,
            instructor: courseInfo.instructor || '',
            semester: courseInfo.semester || 'Fall 2024',
            category: courseInfo.category || 'core',
            weight: courseInfo.weight || 1.0, // For weighted courses
            assessments: courseInfo.assessments || [],
            scores: courseInfo.scores || [],
            finalScore: null,
            grade: null,
            gradePoints: null,
            status: 'in-progress',
            addedAt: new Date().toISOString()
        };

        student.courses.push(course);
        student.updatedAt = new Date().toISOString();

        this.recordCalculation({
            type: 'course_added',
            studentId: studentId,
            courseCode: courseCode,
            courseName: course.name,
            timestamp: new Date().toISOString()
        });

        if (this.config.autoSave) {
            this.saveToStorage();
        }

        return course;
    }

    /**
     * Add assessment score to a course
     * @param {string} studentId - Student ID
     * @param {string} courseCode - Course code
     * @param {Object} assessment - Assessment information
     * @returns {Object} Updated course
     */
    addAssessment(studentId, courseCode, assessment) {
        const student = this.students.get(studentId);
        if (!student) {
            throw new Error(`Student not found: ${studentId}`);
        }

        const course = student.courses.find(c => c.code === courseCode);
        if (!course) {
            throw new Error(`Course not found: ${courseCode}`);
        }

        const assessmentRecord = {
            id: assessment.id || `ASS${Date.now()}`,
            name: assessment.name || 'Unnamed Assessment',
            type: assessment.type || 'exam', // exam, quiz, homework, project, participation
            weight: assessment.weight || 0.2, // Default 20% weight
            maxScore: assessment.maxScore || 100,
            score: assessment.score,
            percentage: (assessment.score / assessment.maxScore) * 100,
            date: assessment.date || new Date().toISOString(),
            comments: assessment.comments || ''
        };

        course.scores.push(assessmentRecord);
        course.updatedAt = new Date().toISOString();

        // Recalculate course grade
        this.calculateCourseGrade(studentId, courseCode);

        this.recordCalculation({
            type: 'assessment_added',
            studentId: studentId,
            courseCode: courseCode,
            assessmentName: assessmentRecord.name,
            score: assessmentRecord.score,
            timestamp: new Date().toISOString()
        });

        if (this.config.autoSave) {
            this.saveToStorage();
        }

        return course;
    }

    /**
     * Calculate final grade for a course
     * @param {string} studentId - Student ID
     * @param {string} courseCode - Course code
     * @returns {Object} Course grade information
     */
    calculateCourseGrade(studentId, courseCode) {
        const student = this.students.get(studentId);
        if (!student) {
            throw new Error(`Student not found: ${studentId}`);
        }

        const course = student.courses.find(c => c.code === courseCode);
        if (!course) {
            throw new Error(`Course not found: ${courseCode}`);
        }

        if (course.scores.length === 0) {
            return null;
        }

        // Calculate weighted average
        let totalWeight = 0;
        let weightedSum = 0;

        for (const assessment of course.scores) {
            const weight = assessment.weight || 0;
            const percentage = assessment.percentage || 0;
            
            weightedSum += (percentage * weight);
            totalWeight += weight;
        }

        // Normalize if total weight doesn't equal 1
        const finalPercentage = totalWeight > 0 ? weightedSum / totalWeight : 0;

        // Calculate final score
        const finalScore = (finalPercentage / 100) * this.config.maxScore;

        // Get grade information
        const gradeInfo = this.calculateGrade(finalScore, {
            maxScore: this.config.maxScore
        });

        // Update course record
        course.finalScore = this.round(finalScore);
        course.finalPercentage = this.round(finalPercentage);
        course.grade = gradeInfo.grade;
        course.gradePoints = gradeInfo.points * course.weight;
        course.status = 'completed';
        course.completedAt = new Date().toISOString();

        // Update student GPA
        this.updateStudentGPA(studentId);

        this.recordCalculation({
            type: 'course_grade_calculated',
            studentId: studentId,
            courseCode: courseCode,
            finalScore: course.finalScore,
            finalGrade: course.grade,
            timestamp: new Date().toISOString()
        });

        if (this.config.autoSave) {
            this.saveToStorage();
        }

        return {
            course: course.code,
            name: course.name,
            finalScore: course.finalScore,
            finalPercentage: course.finalPercentage,
            grade: course.grade,
            gradePoints: course.gradePoints,
            credits: course.credits,
            status: course.status
        };
    }

    /**
     * Update student's cumulative GPA
     * @private
     */
    updateStudentGPA(studentId) {
        const student = this.students.get(studentId);
        if (!student) return;

        let totalPoints = 0;
        let totalCredits = 0;
        let completedCourses = 0;

        for (const course of student.courses) {
            if (course.status === 'completed' && course.gradePoints !== null) {
                totalPoints += (course.gradePoints * course.credits);
                totalCredits += course.credits;
                completedCourses++;
            }
        }

        student.totalPoints = this.round(totalPoints);
        student.totalCredits = totalCredits;
        student.cumulativeGPA = totalCredits > 0 ? this.round(totalPoints / totalCredits) : 0;
        student.completedCourses = completedCourses;
        student.updatedAt = new Date().toISOString();

        // Update statistics
        this.updateOverallStatistics();
    }

    /**
     * Calculate what score is needed to achieve target grade
     * @param {string} studentId - Student ID
     * @param {string} courseCode - Course code
     * @param {string} targetGrade - Target grade (e.g., 'A', 'B+')
     * @returns {Object} Required scores information
     */
    calculateRequiredScore(studentId, courseCode, targetGrade) {
        const student = this.students.get(studentId);
        if (!student) {
            throw new Error(`Student not found: ${studentId}`);
        }

        const course = student.courses.find(c => c.code === courseCode);
        if (!course) {
            throw new Error(`Course not found: ${courseCode}`);
        }

        if (course.status === 'completed') {
            throw new Error('Course already completed');
        }

        // Get current weighted average
        let currentWeightedScore = 0;
        let usedWeight = 0;

        for (const assessment of course.scores) {
            currentWeightedScore += (assessment.percentage * (assessment.weight || 0));
            usedWeight += (assessment.weight || 0);
        }

        // Find remaining weight
        const remainingWeight = 1 - usedWeight;

        if (remainingWeight <= 0) {
            throw new Error('No remaining assessments in course');
        }

        // Find target percentage for the grade
        const scale = this.gradingSystems[this.config.gradingScale].scale;
        const targetGradeInfo = scale.find(g => g.grade === targetGrade);

        if (!targetGradeInfo) {
            throw new Error(`Invalid target grade: ${targetGrade}`);
        }

        // Calculate required final percentage
        const targetPercentage = targetGradeInfo.min;
        const requiredWeightedScore = targetPercentage - currentWeightedScore;
        const requiredFinalPercentage = requiredWeightedScore / remainingWeight;

        // Check if it's achievable
        const isAchievable = requiredFinalPercentage <= 100;

        return {
            currentWeightedScore: this.round(currentWeightedScore),
            usedWeight: this.round(usedWeight),
            remainingWeight: this.round(remainingWeight),
            targetGrade: targetGrade,
            targetMinPercentage: targetGradeInfo.min,
            requiredFinalPercentage: this.round(requiredFinalPercentage),
            isAchievable: isAchievable,
            requiredFinalScore: this.round((requiredFinalPercentage / 100) * this.config.maxScore),
            message: isAchievable 
                ? `You need at least ${this.round(requiredFinalPercentage)}% on remaining assessments`
                : 'Target grade is not achievable with remaining weight'
        };
    }

    /**
     * Generate detailed student report
     * @param {string} studentId - Student ID
     * @returns {Object} Comprehensive student report
     */
    generateStudentReport(studentId) {
        const student = this.students.get(studentId);
        if (!student) {
            throw new Error(`Student not found: ${studentId}`);
        }

        const report = {
            studentInfo: {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                email: student.email,
                program: student.program,
                status: student.status,
                enrollmentDate: student.enrollmentDate
            },
            academicSummary: {
                cumulativeGPA: student.cumulativeGPA,
                totalCredits: student.totalCredits,
                totalPoints: student.totalPoints,
                completedCourses: student.completedCourses,
                currentCourses: student.courses.filter(c => c.status === 'in-progress').length,
                academicStanding: this.determineAcademicStanding(student.cumulativeGPA)
            },
            coursePerformance: [],
            gradeDistribution: {},
            recommendations: []
        };

        // Course performance details
        for (const course of student.courses) {
            const courseReport = {
                code: course.code,
                name: course.name,
                credits: course.credits,
                instructor: course.instructor,
                semester: course.semester,
                status: course.status,
                finalScore: course.finalScore,
                finalPercentage: course.finalPercentage,
                grade: course.grade,
                gradePoints: course.gradePoints,
                assessments: course.scores.map(a => ({
                    name: a.name,
                    type: a.type,
                    score: a.score,
                    maxScore: a.maxScore,
                    percentage: a.percentage,
                    weight: a.weight
                }))
            };

            report.coursePerformance.push(courseReport);

            // Update grade distribution
            if (course.grade) {
                report.gradeDistribution[course.grade] = (report.gradeDistribution[course.grade] || 0) + 1;
            }
        }

        // Generate recommendations
        report.recommendations = this.generateRecommendations(student);

        // Calculate class rank if multiple students
        report.academicSummary.classRank = this.calculateClassRank(studentId);

        return report;
    }

    /**
     * Determine academic standing based on GPA
     * @private
     */
    determineAcademicStanding(gpa) {
        if (gpa >= 3.5) return 'Dean\'s List';
        if (gpa >= 3.0) return 'Good Standing';
        if (gpa >= 2.0) return 'Satisfactory';
        if (gpa >= 1.0) return 'Academic Warning';
        return 'Academic Probation';
    }

    /**
     * Generate student recommendations
     * @private
     */
    generateRecommendations(student) {
        const recommendations = [];

        if (student.cumulativeGPA < 2.0) {
            recommendations.push({
                type: 'critical',
                message: 'Academic probation risk. Consider meeting with academic advisor.',
                action: 'Schedule advisor meeting'
            });
        }

        if (student.courses.some(c => c.status === 'in-progress' && c.scores.length === 0)) {
            recommendations.push({
                type: 'warning',
                message: 'Some courses have no assessment scores recorded.',
                action: 'Update assessment scores'
            });
        }

        // Check for improvement opportunities
        const lowGrades = student.courses.filter(c => 
            c.grade && ['D', 'F'].includes(c.grade.charAt(0))
        );

        if (lowGrades.length > 0) {
            recommendations.push({
                type: 'improvement',
                message: `Found ${lowGrades.length} courses with low grades. Consider retaking or tutoring.`,
                action: 'Review low-performing courses'
            });
        }

        // Check for exceptional performance
        const highGrades = student.courses.filter(c => 
            c.grade && ['A'].includes(c.grade.charAt(0))
        );

        if (highGrades.length >= 3 && student.cumulativeGPA >= 3.5) {
            recommendations.push({
                type: 'opportunity',
                message: 'Excellent academic performance! Consider honors program or research opportunities.',
                action: 'Explore advanced opportunities'
            });
        }

        return recommendations;
    }

    /**
     * Calculate class rank
     * @private
     */
    calculateClassRank(studentId) {
        if (this.students.size < 2) return 'N/A';

        const studentsArray = Array.from(this.students.values())
            .filter(s => s.status === 'active' && s.completedCourses > 0)
            .sort((a, b) => b.cumulativeGPA - a.cumulativeGPA);

        const rank = studentsArray.findIndex(s => s.id === studentId) + 1;
        const total = studentsArray.length;

        return {
            rank: rank,
            total: total,
            percentile: this.round((rank / total) * 100)
        };
    }

    /**
     * Generate institutional statistics
     * @returns {Object} Institutional statistics
     */
    generateInstitutionalStats() {
        const activeStudents = Array.from(this.students.values()).filter(s => s.status === 'active');
        
        const stats = {
            totalStudents: this.students.size,
            activeStudents: activeStudents.length,
            totalCourses: activeStudents.reduce((sum, student) => sum + student.courses.length, 0),
            averageGPA: this.round(this.statistics.averageGPA),
            highestGPA: this.round(this.statistics.highestGPA),
            lowestGPA: this.round(this.statistics.lowestGPA),
            gradeDistribution: {},
            departmentStats: {},
            successRate: 0
        };

        // Calculate grade distribution
        for (const student of activeStudents) {
            for (const course of student.courses) {
                if (course.grade) {
                    stats.gradeDistribution[course.grade] = (stats.gradeDistribution[course.grade] || 0) + 1;
                }
            }

            // Department statistics
            const dept = student.program || 'Undeclared';
            stats.departmentStats[dept] = stats.departmentStats[dept] || {
                students: 0,
                averageGPA: 0,
                totalCourses: 0
            };
            stats.departmentStats[dept].students++;
            stats.departmentStats[dept].averageGPA += student.cumulativeGPA;
            stats.departmentStats[dept].totalCourses += student.courses.length;
        }

        // Calculate averages for departments
        for (const dept in stats.departmentStats) {
            if (stats.departmentStats[dept].students > 0) {
                stats.departmentStats[dept].averageGPA = this.round(
                    stats.departmentStats[dept].averageGPA / stats.departmentStats[dept].students
                );
            }
        }

        // Calculate success rate (percentage of passing grades)
        const totalGrades = Object.values(stats.gradeDistribution).reduce((a, b) => a + b, 0);
        const passingGrades = Object.entries(stats.gradeDistribution)
            .filter(([grade]) => !['F'].includes(grade.charAt(0)))
            .reduce((sum, [, count]) => sum + count, 0);

        stats.successRate = totalGrades > 0 ? this.round((passingGrades / totalGrades) * 100) : 0;

        return stats;
    }

    /**
     * Export data in various formats
     * @param {string} format - Export format ('json', 'csv', 'pdf')
     * @param {string} type - Data type ('student', 'institutional', 'all')
     * @returns {string|Object} Exported data
     */
    exportData(format = 'json', type = 'all') {
        let data;

        switch (type) {
            case 'student':
                data = Array.from(this.students.values());
                break;
            case 'institutional':
                data = this.generateInstitutionalStats();
                break;
            case 'all':
                data = {
                    students: Array.from(this.students.values()),
                    statistics: this.statistics,
                    institutionalStats: this.generateInstitutionalStats(),
                    config: this.config,
                    exportDate: new Date().toISOString(),
                    version: '2.0.0'
                };
                break;
            default:
                throw new Error(`Invalid export type: ${type}`);
        }

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            case 'pdf':
                // In a real implementation, this would generate a PDF
                console.log('PDF export would be generated here');
                return data;
            default:
                return data;
        }
    }

    /**
     * Convert data to CSV format
     * @private
     */
    convertToCSV(data) {
        if (Array.isArray(data)) {
            if (data.length === 0) return '';
            
            const headers = Object.keys(data[0]);
            const rows = data.map(obj => 
                headers.map(header => JSON.stringify(obj[header] || '')).join(',')
            );
            
            return [headers.join(','), ...rows].join('\n');
        }
        
        // For single object
        return Object.entries(data)
            .map(([key, value]) => `${key},${JSON.stringify(value)}`)
            .join('\n');
    }

    /**
     * Update overall statistics
     * @private
     */
    updateStatistics(gradePoints) {
        this.statistics.averageGPA = (
            (this.statistics.averageGPA * (this.statistics.totalCalculations - 1) + gradePoints) 
            / this.statistics.totalCalculations
        );

        this.statistics.highestGPA = Math.max(this.statistics.highestGPA, gradePoints);
        this.statistics.lowestGPA = Math.min(this.statistics.lowestGPA, gradePoints);
    }

    /**
     * Update overall statistics from all students
     * @private
     */
    updateOverallStatistics() {
        const activeStudents = Array.from(this.students.values()).filter(s => s.status === 'active');
        
        if (activeStudents.length === 0) {
            this.statistics.averageGPA = 0;
            this.statistics.highestGPA = 0;
            this.statistics.lowestGPA = 4.0;
            return;
        }

        let totalGPA = 0;
        let highest = 0;
        let lowest = 4.0;

        for (const student of activeStudents) {
            totalGPA += student.cumulativeGPA;
            highest = Math.max(highest, student.cumulativeGPA);
            lowest = Math.min(lowest, student.cumulativeGPA);
        }

        this.statistics.averageGPA = totalGPA / activeStudents.length;
        this.statistics.highestGPA = highest;
        this.statistics.lowestGPA = lowest;
    }

    /**
     * Record calculation in history
     * @private
     */
    recordCalculation(record) {
        this.history.unshift({
            ...record,
            sessionId: this.sessionId,
            id: `REC${Date.now()}${Math.random().toString(36).substr(2, 5)}`
        });

        // Keep history limited
        if (this.history.length > 1000) {
            this.history = this.history.slice(0, 1000);
        }
    }

    /**
     * Round number to specified decimal places
     * @private
     */
    round(number) {
        const factor = Math.pow(10, this.config.decimalPlaces);
        return Math.round(number * factor) / factor;
    }

    /**
     * Save data to localStorage
     * @private
     */
    saveToStorage() {
        if (typeof window === 'undefined' || !window.localStorage) return;

        try {
            const data = {
                students: Array.from(this.students.entries()),
                statistics: this.statistics,
                history: this.history.slice(0, 100), // Save only recent history
                config: this.config,
                savedAt: new Date().toISOString()
            };

            localStorage.setItem('gradeCalculatorData', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    /**
     * Load data from localStorage
     * @private
     */
    loadFromStorage() {
        if (typeof window === 'undefined' || !window.localStorage) return;

        try {
            const saved = localStorage.getItem('gradeCalculatorData');
            if (!saved) return;

            const data = JSON.parse(saved);
            
            // Restore students
            this.students = new Map(data.students || []);
            
            // Restore other data
            this.statistics = data.statistics || this.statistics;
            this.history = data.history || this.history;
            this.config = { ...this.config, ...data.config };

            console.log(`Loaded ${this.students.size} students from storage`);
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
    }

    /**
     * Clear all data
     * @param {boolean} confirm - Confirmation flag
     * @returns {boolean} Success status
     */
    clearData(confirm = false) {
        if (!confirm) {
            console.warn('Clear operation requires confirmation');
            return false;
        }

        this.students.clear();
        this.courses.clear();
        this.history = [];
        this.statistics = {
            totalCalculations: 0,
            totalStudents: 0,
            averageGPA: 0,
            highestGPA: 0,
            lowestGPA: 4.0
        };

        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('gradeCalculatorData');
        }

        console.log('All data cleared successfully');
        return true;
    }

    /**
     * Get system information
     * @returns {Object} System information
     */
    getSystemInfo() {
        return {
            version: '2.0.0',
            sessionId: this.sessionId,
            studentsCount: this.students.size,
            calculationsCount: this.statistics.totalCalculations,
            historyEntries: this.history.length,
            config: this.config,
            gradingSystem: this.gradingSystems[this.config.gradingScale].name,
            uptime: Date.now() - parseInt(this.sessionId.split('-')[1])
        };
    }
}

// Web Interface Module
class GradeCalculatorUI {
    constructor(calculator) {
        this.calculator = calculator || new GradeCalculator();
        this.currentView = 'dashboard';
        this.currentStudentId = null;
        
        // UI State
        this.uiState = {
            darkMode: false,
            animations: true,
            compactView: false,
            language: 'en'
        };

        this.initializeUI();
    }

    /**
     * Initialize the UI
     * @private
     */
    initializeUI() {
        console.log('📊 Grade Calculator UI Initialized');
        
        // Apply dark mode if enabled
        if (this.uiState.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        this.renderDashboard();
    }

    /**
     * Render main dashboard
     */
    renderDashboard() {
        const stats = this.calculator.generateInstitutionalStats();
        const systemInfo = this.calculator.getSystemInfo();

        return `
            <div class="dashboard">
                <div class="dashboard-header">
                    <h1>🎓 Academic Grade Calculator</h1>
                    <p class="subtitle">Professional Grade Management System v${systemInfo.version}</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <h3>Total Students</h3>
                            <p class="stat-value">${stats.totalStudents}</p>
                            <p class="stat-subtitle">Active: ${stats.activeStudents}</p>
                        </div>
                    </div>

                    <div class="stat-card success">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <h3>Average GPA</h3>
                            <p class="stat-value">${stats.averageGPA}</p>
                            <p class="stat-subtitle">Out of 4.0 Scale</p>
                        </div>
                    </div>

                    <div class="stat-card warning">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <h3>Success Rate</h3>
                            <p class="stat-value">${stats.successRate}%</p>
                            <p class="stat-subtitle">Passing Grades</p>
                        </div>
                    </div>

                    <div class="stat-card info">
                        <div class="stat-icon">📚</div>
                        <div class="stat-content">
                            <h3>Total Courses</h3>
                            <p class="stat-value">${stats.totalCourses}</p>
                            <p class="stat-subtitle">Across All Students</p>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="ui.registerStudentForm()">
                        👤 Register Student
                    </button>
                    <button class="btn btn-secondary" onclick="ui.quickGradeCalculator()">
                        🧮 Quick Grade Calc
                    </button>
                    <button class="btn btn-success" onclick="ui.viewAllStudents()">
                        📋 View All Students
                    </button>
                    <button class="btn btn-info" onclick="ui.generateReports()">
                        📊 Generate Reports
                    </button>
                </div>

                <div class="recent-activity">
                    <h3>📝 Recent Activity</h3>
                    <div class="activity-list">
                        ${this.renderRecentActivity()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render quick grade calculator
     */
    quickGradeCalculator() {
        return `
            <div class="quick-calculator">
                <h2>🧮 Quick Grade Calculator</h2>
                
                <div class="calculator-form">
                    <div class="form-group">
                        <label for="score">Score</label>
                        <input type="number" id="score" placeholder="Enter score" min="0" max="100" step="0.1">
                    </div>

                    <div class="form-group">
                        <label for="maxScore">Maximum Score</label>
                        <input type="number" id="maxScore" value="100" min="1" step="1">
                    </div>

                    <div class="form-group">
                        <label for="gradingScale">Grading Scale</label>
                        <select id="gradingScale">
                            <option value="standard">Standard 4.0 Scale</option>
                            <option value="weighted">Weighted (AP/Honors)</option>
                            <option value="uk">UK University Scale</option>
                            <option value="european">European ECTS</option>
                        </select>
                    </div>

                    <button class="btn btn-primary" onclick="ui.calculateQuickGrade()">
                        Calculate Grade
                    </button>
                </div>

                <div id="quickResult" class="result-container" style="display: none;">
                    <!-- Results will be displayed here -->
                </div>
            </div>
        `;
    }

    /**
     * Render student registration form
     */
    registerStudentForm() {
        return `
            <div class="student-registration">
                <h2>👤 Register New Student</h2>
                
                <form id="studentForm" onsubmit="ui.handleStudentRegistration(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" id="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <input type="text" id="lastName" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email">
                    </div>

                    <div class="form-group">
                        <label for="studentId">Student ID</label>
                        <input type="text" id="studentId" placeholder="Auto-generated if empty">
                    </div>

                    <div class="form-group">
                        <label for="program">Academic Program</label>
                        <select id="program">
                            <option value="Computer Science">Computer Science</option>
                            <option value="Business Administration">Business Administration</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Medicine">Medicine</option>
                            <option value="Arts">Arts</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="btn btn-success">Register Student</button>
                        <button type="button" class="btn btn-secondary" onclick="ui.renderDashboard()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Render all students view
     */
    viewAllStudents() {
        const students = Array.from(this.calculator.students.values());
        
        if (students.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">👤</div>
                    <h3>No Students Registered</h3>
                    <p>Register students to start using the grade calculator.</p>
                    <button class="btn btn-primary" onclick="ui.registerStudentForm()">
                        Register First Student
                    </button>
                </div>
            `;
        }

        let html = `
            <div class="students-list">
                <h2>📋 All Students (${students.length})</h2>
                
                <div class="students-grid">
        `;

        students.forEach(student => {
            const standing = this.calculator.determineAcademicStanding(student.cumulativeGPA);
            const standingClass = this.getStandingClass(standing);
            
            html += `
                <div class="student-card" onclick="ui.viewStudentDetail('${student.id}')">
                    <div class="student-avatar">
                        ${student.firstName.charAt(0)}${student.lastName.charAt(0)}
                    </div>
                    <div class="student-info">
                        <h4>${student.firstName} ${student.lastName}</h4>
                        <p class="student-id">${student.id}</p>
                        <p class="student-program">${student.program}</p>
                    </div>
                    <div class="student-stats">
                        <span class="gpa-badge">GPA: ${student.cumulativeGPA}</span>
                        <span class="standing-badge ${standingClass}">${standing}</span>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Get CSS class for academic standing
     * @private
     */
    getStandingClass(standing) {
        const classes = {
            "Dean's List": "standing-excellent",
            "Good Standing": "standing-good",
            "Satisfactory": "standing-average",
            "Academic Warning": "standing-warning",
            "Academic Probation": "standing-critical"
        };
        return classes[standing] || "standing-average";
    }

    /**
     * Render student detail view
     */
    viewStudentDetail(studentId) {
        const student = this.calculator.students.get(studentId);
        if (!student) return this.renderDashboard();

        const report = this.calculator.generateStudentReport(studentId);
        this.currentStudentId = studentId;

        return `
            <div class="student-detail">
                <div class="detail-header">
                    <button class="btn btn-back" onclick="ui.viewAllStudents()">
                        ← Back to Students
                    </button>
                    <h2>${student.firstName} ${student.lastName}</h2>
                    <p class="student-meta">${student.id} • ${student.program}</p>
                </div>

                <div class="detail-summary">
                    <div class="summary-card">
                        <h3>Cumulative GPA</h3>
                        <div class="gpa-display">${student.cumulativeGPA}</div>
                        <p class="gpa-label">Out of 4.0</p>
                    </div>

                    <div class="summary-card">
                        <h3>Academic Standing</h3>
                        <div class="standing-display ${this.getStandingClass(report.academicSummary.academicStanding)}">
                            ${report.academicSummary.academicStanding}
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3>Completed Courses</h3>
                        <div class="courses-count">${student.completedCourses || 0}</div>
                        <p class="courses-label">Total Credits: ${student.totalCredits}</p>
                    </div>
                </div>

                <div class="detail-tabs">
                    <button class="tab-btn active" onclick="ui.showStudentTab('courses')">
                        📚 Courses
                    </button>
                    <button class="tab-btn" onclick="ui.showStudentTab('grades')">
                        📊 Grades
                    </button>
                    <button class="tab-btn" onclick="ui.showStudentTab('recommendations')">
                        💡 Recommendations
                    </button>
                    <button class="tab-btn" onclick="ui.showStudentTab('actions')">
                        ⚡ Actions
                    </button>
                </div>

                <div id="studentTabContent" class="tab-content">
                    ${this.renderStudentCourses(student)}
                </div>
            </div>
        `;
    }

    /**
     * Render student courses tab
     */
    renderStudentCourses(student) {
        if (student.courses.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No Courses Registered</h3>
                    <p>Add courses to this student's record.</p>
                    <button class="btn btn-primary" onclick="ui.showAddCourseForm()">
                        Add First Course
                    </button>
                </div>
            `;
        }

        let html = `
            <div class="courses-list">
                <div class="list-header">
                    <h3>Registered Courses</h3>
                    <button class="btn btn-primary btn-sm" onclick="ui.showAddCourseForm()">
                        + Add Course
                    </button>
                </div>
        `;

        student.courses.forEach(course => {
            const statusClass = course.status === 'completed' ? 'status-completed' : 'status-in-progress';
            const gradeClass = this.getGradeClass(course.grade);
            
            html += `
                <div class="course-card" onclick="ui.viewCourseDetail('${course.code}')">
                    <div class="course-header">
                        <h4>${course.code}: ${course.name}</h4>
                        <span class="course-credits">${course.credits} credits</span>
                    </div>
                    
                    <div class="course-info">
                        <span class="course-instructor">${course.instructor}</span>
                        <span class="course-semester">${course.semester}</span>
                        <span class="course-status ${statusClass}">${course.status}</span>
                    </div>

                    ${course.finalScore !== null ? `
                        <div class="course-grade">
                            <span class="grade-score">${course.finalScore}/${this.calculator.config.maxScore}</span>
                            <span class="grade-letter ${gradeClass}">${course.grade}</span>
                            <span class="grade-points">${course.gradePoints} points</span>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `</div>`;
        return html;
    }

    /**
     * Get CSS class for grade
     * @private
     */
    getGradeClass(grade) {
        if (!grade) return 'grade-none';
        
        const firstChar = grade.charAt(0);
        if (['A'].includes(firstChar)) return 'grade-a';
        if (['B'].includes(firstChar)) return 'grade-b';
        if (['C'].includes(firstChar)) return 'grade-c';
        if (['D'].includes(firstChar)) return 'grade-d';
        if (['F'].includes(firstChar)) return 'grade-f';
        return 'grade-other';
    }

    /**
     * Show add course form
     */
    showAddCourseForm() {
        return `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>➕ Add New Course</h3>
                        <button class="btn-close" onclick="ui.closeModal()">×</button>
                    </div>
                    
                    <form id="courseForm" onsubmit="ui.handleAddCourse(event)">
                        <div class="form-group">
                            <label for="courseCode">Course Code *</label>
                            <input type="text" id="courseCode" required placeholder="e.g., CS101">
                        </div>

                        <div class="form-group">
                            <label for="courseName">Course Name *</label>
                            <input type="text" id="courseName" required placeholder="e.g., Introduction to Programming">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="courseCredits">Credits</label>
                                <input type="number" id="courseCredits" value="3" min="1" max="10">
                            </div>
                            <div class="form-group">
                                <label for="courseWeight">Weight</label>
                                <input type="number" id="courseWeight" value="1.0" step="0.1" min="0.5" max="2.0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="courseInstructor">Instructor</label>
                            <input type="text" id="courseInstructor" placeholder="Instructor name">
                        </div>

                        <div class="form-group">
                            <label for="courseSemester">Semester</label>
                            <input type="text" id="courseSemester" value="Fall 2024">
                        </div>

                        <div class="modal-buttons">
                            <button type="submit" class="btn btn-success">Add Course</button>
                            <button type="button" class="btn btn-secondary" onclick="ui.closeModal()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Calculate quick grade
     */
    calculateQuickGrade() {
        const score = parseFloat(document.getElementById('score').value);
        const maxScore = parseFloat(document.getElementById('maxScore').value);
        const scale = document.getElementById('gradingScale').value;

        try {
            const result = this.calculator.calculateGrade(score, {
                maxScore: maxScore,
                customScale: this.calculator.gradingSystems[scale].scale
            });

            const resultDiv = document.getElementById('quickResult');
            resultDiv.innerHTML = `
                <div class="result-card ${result.isPassing ? 'result-pass' : 'result-fail'}">
                    <h4>Grade Result</h4>
                    <div class="result-score">${result.score}/${maxScore} (${result.percentage}%)</div>
                    <div class="result-grade">Grade: <span class="grade-${result.grade.toLowerCase()}">${result.grade}</span></div>
                    <div class="result-points">Grade Points: ${result.points}</div>
                    <div class="result-status">Status: ${result.isPassing ? '✅ Passing' : '❌ Failing'}</div>
                    <div class="result-description">${result.description}</div>
                </div>
            `;
            resultDiv.style.display = 'block';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * Handle student registration
     */
    handleStudentRegistration(event) {
        event.preventDefault();
        
        const studentData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            id: document.getElementById('studentId').value || undefined,
            program: document.getElementById('program').value
        };

        try {
            const studentId = this.calculator.registerStudent(studentData);
            alert(`Student registered successfully! ID: ${studentId}`);
            this.viewStudentDetail(studentId);
        } catch (error) {
            alert(`Registration failed: ${error.message}`);
        }
    }

    /**
     * Handle add course
     */
    handleAddCourse(event) {
        event.preventDefault();
        
        if (!this.currentStudentId) {
            alert('No student selected');
            return;
        }

        const courseData = {
            code: document.getElementById('courseCode').value,
            name: document.getElementById('courseName').value,
            credits: parseInt(document.getElementById('courseCredits').value),
            weight: parseFloat(document.getElementById('courseWeight').value),
            instructor: document.getElementById('courseInstructor').value,
            semester: document.getElementById('courseSemester').value
        };

        try {
            this.calculator.addCourse(this.currentStudentId, courseData);
            this.closeModal();
            this.viewStudentDetail(this.currentStudentId);
        } catch (error) {
            alert(`Failed to add course: ${error.message}`);
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Render recent activity
     * @private
     */
    renderRecentActivity() {
        const recent = this.calculator.history.slice(0, 5);
        
        if (recent.length === 0) {
            return '<p class="no-activity">No recent activity</p>';
        }

        let html = '';
        recent.forEach(record => {
            const time = new Date(record.timestamp).toLocaleTimeString();
            let icon = '📝';
            let text = '';

            switch (record.type) {
                case 'student_registration':
                    icon = '👤';
                    text = `New student: ${record.studentName}`;
                    break;
                case 'course_added':
                    icon = '📚';
                    text = `Course added: ${record.courseName}`;
                    break;
                case 'assessment_added':
                    icon = '📊';
                    text = `Assessment: ${record.assessmentName} - ${record.score}`;
                    break;
                case 'grade_calculation':
                    icon = '🧮';
                    text = `Grade calculated: ${record.score} → ${record.grade}`;
                    break;
                default:
                    text = record.type;
            }

            html += `
                <div class="activity-item">
                    <span class="activity-icon">${icon}</span>
                    <span class="activity-text">${text}</span>
                    <span class="activity-time">${time}</span>
                </div>
            `;
        });

        return html;
    }

    /**
     * Show student tab
     */
    showStudentTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update content based on tab
        const contentDiv = document.getElementById('studentTabContent');
        const student = this.calculator.students.get(this.currentStudentId);

        switch (tabName) {
            case 'courses':
                contentDiv.innerHTML = this.renderStudentCourses(student);
                break;
            case 'grades':
                contentDiv.innerHTML = this.renderGradeDistribution(student);
                break;
            case 'recommendations':
                contentDiv.innerHTML = this.renderRecommendations(student);
                break;
            case 'actions':
                contentDiv.innerHTML = this.renderStudentActions(student);
                break;
        }
    }

    /**
     * Render grade distribution
     */
    renderGradeDistribution(student) {
        const report = this.calculator.generateStudentReport(student.id);
        
        let html = `
            <div class="grade-distribution">
                <h3>📊 Grade Distribution</h3>
                
                <div class="distribution-chart">
                    <div class="chart-placeholder">
                        <!-- In a real implementation, this would be a chart -->
                        <p>Grade distribution chart would appear here</p>
                    </div>
                </div>

                <div class="grade-stats">
        `;

        for (const [grade, count] of Object.entries(report.gradeDistribution)) {
            const percentage = (count / report.coursePerformance.length) * 100;
            html += `
                <div class="grade-stat">
                    <span class="grade-letter ${this.getGradeClass(grade)}">${grade}</span>
                    <span class="grade-count">${count} courses</span>
                    <span class="grade-percentage">${percentage.toFixed(1)}%</span>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render recommendations
     */
    renderRecommendations(student) {
        const report = this.calculator.generateStudentReport(student.id);
        
        if (report.recommendations.length === 0) {
            return `
                <div class="no-recommendations">
                    <div class="empty-icon">✅</div>
                    <h3>No Recommendations</h3>
                    <p>Student is performing well. No action required at this time.</p>
                </div>
            `;
        }

        let html = `
            <div class="recommendations-list">
                <h3>💡 Recommendations & Actions</h3>
        `;

        report.recommendations.forEach(rec => {
            html += `
                <div class="recommendation-card ${rec.type}">
                    <div class="rec-icon">
                        ${rec.type === 'critical' ? '⚠️' : rec.type === 'warning' ? '🔶' : '💡'}
                    </div>
                    <div class="rec-content">
                        <h4>${rec.message}</h4>
                        <p>${rec.action}</p>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        return html;
    }

    /**
     * Render student actions
     */
    renderStudentActions(student) {
        return `
            <div class="student-actions">
                <h3>⚡ Available Actions</h3>
                
                <div class="action-grid">
                    <button class="action-btn" onclick="ui.downloadStudentReport('${student.id}')">
                        <span class="action-icon">📄</span>
                        <span class="action-text">Download Report</span>
                    </button>

                    <button class="action-btn" onclick="ui.showGradePrediction('${student.id}')">
                        <span class="action-icon">🔮</span>
                        <span class="action-text">Grade Prediction</span>
                    </button>

                    <button class="action-btn" onclick="ui.showCourseHistory('${student.id}')">
                        <span class="action-icon">📅</span>
                        <span class="action-text">Course History</span>
                    </button>

                    <button class="action-btn" onclick="ui.showAcademicPlan('${student.id}')">
                        <span class="action-icon">🗺️</span>
                        <span class="action-text">Academic Plan</span>
                    </button>

                    <button class="action-btn" onclick="ui.exportStudentData('${student.id}')">
                        <span class="action-icon">💾</span>
                        <span class="action-text">Export Data</span>
                    </button>

                    <button class="action-btn danger" onclick="ui.archiveStudent('${student.id}')">
                        <span class="action-icon">🗄️</span>
                        <span class="action-text">Archive Student</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Download student report
     */
    downloadStudentReport(studentId) {
        const report = this.calculator.generateStudentReport(studentId);
        const dataStr = JSON.stringify(report, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `student-report-${studentId}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Report downloaded successfully!');
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        GradeCalculator,
        GradeCalculatorUI
    };
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.GradeCalculator = GradeCalculator;
    window.GradeCalculatorUI = GradeCalculatorUI;
    
    console.log(`
    🎓 Professional Grade Calculator v2.0.0
    =======================================
    
    Available in global scope:
    1. window.GradeCalculator - Core calculation engine
    2. window.GradeCalculatorUI - Web interface
    
    Example usage:
    
    // Create calculator instance
    const calculator = new GradeCalculator({
        gradingScale: 'standard',
        decimalPlaces: 2
    });
    
    // Register a student
    const studentId = calculator.registerStudent({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        program: 'Computer Science'
    });
    
    // Calculate a grade
    const grade = calculator.calculateGrade(85);
    console.log(grade);
    
    // To use UI:
    const ui = new GradeCalculatorUI(calculator);
    `);
}

// Auto-initialize demo if in browser
if (typeof window !== 'undefined' && !window.GradeCalculatorDemoLoaded) {
    window.GradeCalculatorDemoLoaded = true;
    
    // Create demo instance
    window.demoCalculator = new GradeCalculator();
    window.demoUI = new GradeCalculatorUI(window.demoCalculator);
    
    console.log('📦 Grade Calculator Demo loaded!');
    console.log('Access demo via: window.demoCalculator and window.demoUI');
}
