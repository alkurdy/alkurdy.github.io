/* ==========================================================================
   Learning Archive Statistics Calculator
   ========================================================================== */

class LearningStats {
    constructor() {
        this.courses = [];
        this.certifications = [];
        this.init();
    }

    init() {
        this.loadCourseData();
        this.loadCertificationData();
        this.calculateAndUpdateStats();
    }

    loadCourseData() {
        // Extract course data from the table
        const courseRows = document.querySelectorAll('.course-row');
        
        courseRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 7) {
                const course = {
                    code: cells[0].textContent.trim(),
                    title: cells[1].textContent.trim(),
                    origin: cells[2].textContent.trim(),
                    term: cells[3].textContent.trim(),
                    grade: cells[4].textContent.trim(),
                    transfer: cells[5].textContent.trim(),
                    credits: parseInt(cells[6].textContent.trim()),
                    type: this.determineCourseType(row.className, cells[2].textContent.trim())
                };
                this.courses.push(course);
            }
        });
    }

    loadCertificationData() {
        // Extract certification data from the table
        const certRows = document.querySelectorAll('#previous-learning tbody tr');
        
        certRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const cert = {
                    name: cells[0].textContent.trim(),
                    provider: cells[1].textContent.trim(),
                    status: cells[2].textContent.trim(),
                    credentialId: cells[3].textContent.trim(),
                    skills: cells[4].textContent.trim(),
                    isActive: !cells[2].textContent.includes('Expired')
                };
                this.certifications.push(cert);
            }
        });
    }

    determineCourseType(className, origin) {
        if (className.includes('uva')) return 'UVA';
        if (className.includes('nvcc-transfer')) return 'NVCC-Transfer';
        if (className.includes('nvcc-direct')) return 'NVCC-Direct';
        return origin;
    }

    calculateNVCCStats() {
        const nvccCourses = this.courses.filter(course => 
            course.type === 'NVCC-Direct' || course.origin === 'NVCC'
        );
        
        // Filter out "In Progress" and "Transfer" courses for GPA calculation
        const completedCourses = nvccCourses.filter(course => 
            course.grade !== 'In Progress' && course.grade !== 'Transfer'
        );
        
        const totalCredits = nvccCourses.reduce((sum, course) => sum + course.credits, 0);
        const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
        const gradePoints = this.calculateGradePoints(completedCourses);
        
        // Only calculate GPA if there are completed courses
        const gpa = completedCredits > 0 ? (gradePoints / completedCredits).toFixed(2) : '0.00';
        
        return {
            totalCredits,
            gpa,
            degree: 'A.S.',
            honors: parseFloat(gpa) >= 3.5 ? 'Cum Laude' : (parseFloat(gpa) >= 3.25 ? 'Honors' : 'Graduate')
        };
    }

    calculateUVAStats() {
        const uvaCourses = this.courses.filter(course => course.type === 'UVA');
        const transferCourses = this.courses.filter(course => course.type === 'NVCC-Transfer');
        
        // Filter out "In Progress" courses for GPA calculation
        const completedUVACourses = uvaCourses.filter(course => 
            course.grade !== 'In Progress' && course.grade !== 'Transfer'
        );
        
        const uvaDirectCredits = uvaCourses.reduce((sum, course) => sum + course.credits, 0);
        const transferCredits = transferCourses.reduce((sum, course) => sum + course.credits, 0);
        const totalCredits = uvaDirectCredits + transferCredits;
        
        // Calculate UVA GPA (only from completed direct UVA courses)
        const completedUVACredits = completedUVACourses.reduce((sum, course) => sum + course.credits, 0);
        const gradePoints = this.calculateGradePoints(completedUVACourses);
        const uvaGpa = completedUVACredits > 0 ? (gradePoints / completedUVACredits).toFixed(2) : '0.00';
        
        // Calculate program completion (assuming 120 total credits needed)
        const programComplete = Math.round((totalCredits / 120) * 100);
        
        // Estimate graduation date based on current progress
        const currentYear = new Date().getFullYear();
        const currentSemester = this.getCurrentSemester();
        const remainingCredits = 120 - totalCredits;
        const semestersRemaining = Math.ceil(remainingCredits / 12); // Assuming 12 credits per semester
        const graduationDate = this.calculateGraduationDate(currentYear, currentSemester, semestersRemaining);
        
        return {
            uvaDirectCredits,
            transferCredits,
            totalCredits,
            uvaGpa,
            programComplete: `${programComplete}%`,
            graduationDate,
            degree: 'B.I.S.'
        };
    }

    calculateCertificationStats() {
        const totalCerts = this.certifications.length;
        const activeCerts = this.certifications.filter(cert => cert.isActive).length;
        
        // Count unique vendors
        const vendors = new Set(this.certifications.map(cert => cert.provider));
        const uniqueVendors = vendors.size;
        
        // Calculate years of certification (from earliest cert to now)
        const years = this.calculateCertificationYears();
        
        return {
            total: totalCerts,
            active: activeCerts,
            vendors: uniqueVendors,
            years: `${years}+`
        };
    }

    calculateGradePoints(courses) {
        const gradeScale = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        
        return courses.reduce((total, course) => {
            const grade = course.grade.trim();
            // Skip "In Progress", "Transfer", and any unrecognized grades
            if (grade === 'In Progress' || grade === 'Transfer' || !gradeScale.hasOwnProperty(grade)) {
                return total;
            }
            const points = gradeScale[grade];
            return total + (points * course.credits);
        }, 0);
    }

    getCurrentSemester() {
        const month = new Date().getMonth() + 1; // 1-12
        if (month >= 1 && month <= 5) return 'Spring';
        if (month >= 6 && month <= 8) return 'Summer';
        return 'Fall';
    }

    calculateGraduationDate(currentYear, currentSemester, semestersRemaining) {
        const semesters = ['Spring', 'Summer', 'Fall'];
        let currentSemesterIndex = semesters.indexOf(currentSemester);
        let year = currentYear;
        
        for (let i = 0; i < semestersRemaining; i++) {
            currentSemesterIndex++;
            if (currentSemesterIndex >= 3) {
                currentSemesterIndex = 0;
                year++;
            }
        }
        
        return `${semesters[currentSemesterIndex]} ${year}`;
    }

    calculateCertificationYears() {
        const currentYear = new Date().getFullYear();
        const earliestYear = Math.min(...this.certifications.map(cert => {
            const match = cert.status.match(/(\d{4})/);
            return match ? parseInt(match[1]) : currentYear;
        }));
        
        return currentYear - earliestYear + 1;
    }

    updateStatsDisplay() {
        const nvccStats = this.calculateNVCCStats();
        const uvaStats = this.calculateUVAStats();
        const certStats = this.calculateCertificationStats();
        
        // Update NVCC stats
        this.updateStatElement('nvcc-total-credits', nvccStats.totalCredits);
        this.updateStatElement('nvcc-gpa', nvccStats.gpa);
        this.updateStatElement('nvcc-degree', nvccStats.degree);
        this.updateStatElement('nvcc-honors', nvccStats.honors);
        
        // Update UVA stats
        this.updateStatElement('uva-direct-credits', uvaStats.uvaDirectCredits);
        this.updateStatElement('uva-transfer-credits', uvaStats.transferCredits);
        this.updateStatElement('uva-total-credits', uvaStats.totalCredits);
        this.updateStatElement('uva-gpa', uvaStats.uvaGpa);
        this.updateStatElement('uva-program-complete', uvaStats.programComplete);
        this.updateStatElement('uva-graduation-date', uvaStats.graduationDate);
        this.updateStatElement('uva-degree', uvaStats.degree);
        
        // Update certification stats
        this.updateStatElement('cert-total', certStats.total);
        this.updateStatElement('cert-active', certStats.active);
        this.updateStatElement('cert-vendors', certStats.vendors);
        this.updateStatElement('cert-years', certStats.years);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    calculateAndUpdateStats() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateStatsDisplay();
            });
        } else {
            this.updateStatsDisplay();
        }
    }
}

// Initialize the stats calculator when the script loads
const learningStats = new LearningStats();