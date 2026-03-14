/**
 * AI Learn Hub - Client-Side Application Manager
 * Complete offline functionality without server dependency
 */

class AILearnHub {
    constructor() {
        this.db = {
            users: JSON.parse(localStorage.getItem('ailearn_users') || '[]'),
            courses: JSON.parse(localStorage.getItem('ailearn_courses') || '[]'),
            enrollments: JSON.parse(localStorage.getItem('ailearn_enrollments') || '[]'),
            purchases: JSON.parse(localStorage.getItem('ailearn_purchases') || '[]'),
            userData: JSON.parse(localStorage.getItem('ailearn_userData') || 'null'),
        };
        this.currentUser = JSON.parse(sessionStorage.getItem('ailearn_currentUser') || 'null');
        this.initializeSampleData();
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        // Always ensure admin user exists
        if (!this.db.users.find(u => u.email === 'admin@ailearnhub.com')) {
            this.createAdminUser();
        }

        if (this.db.courses.length === 0) {
            this.db.courses = [
                {
                    id: 1,
                    title: 'AI Fundamentals',
                    slug: 'ai-fundamentals',
                    description: 'Learn the basics of AI, types, and its role in daily life.',
                    price: 299,
                    modules: [
                        { id: 1, title: 'Introduction to AI', lessons: 12 },
                        { id: 2, title: 'Types of AI', lessons: 8 },
                        { id: 3, title: 'AI in Daily Life', lessons: 6 }
                    ],
                    rating: 4.8,
                    students: 15420,
                    duration: '40 hours',
                    instructor: 'Dr. Sarah Chen',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%2300d4ff" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">🤖</text></svg>'
                },
                {
                    id: 2,
                    title: 'Machine Learning',
                    slug: 'machine-learning',
                    description: 'From beginner to advanced ML concepts, algorithms, and applications.',
                    price: 399,
                    modules: [
                        { id: 1, title: 'ML Basics', lessons: 10 },
                        { id: 2, title: 'Supervised Learning', lessons: 15 },
                        { id: 3, title: 'Unsupervised Learning', lessons: 12 },
                        { id: 4, title: 'Real-World Projects', lessons: 8 }
                    ],
                    rating: 4.9,
                    students: 28560,
                    duration: '60 hours',
                    instructor: 'Prof. Michael Wong',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%2300ff88" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="black" font-family="Arial" dy=".3em">📊</text></svg>'
                },
                {
                    id: 3,
                    title: 'Deep Learning',
                    slug: 'deep-learning',
                    description: 'Neural networks, CNN, RNN, and real-world use cases.',
                    price: 499,
                    modules: [
                        { id: 1, title: 'Neural Networks Basics', lessons: 12 },
                        { id: 2, title: 'Convolutional Neural Networks', lessons: 14 },
                        { id: 3, title: 'Recurrent Neural Networks', lessons: 13 },
                        { id: 4, title: 'Advanced Architectures', lessons: 10 }
                    ],
                    rating: 4.7,
                    students: 12340,
                    duration: '75 hours',
                    instructor: 'Dr. James Liu',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%238a2be2" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">🧠</text></svg>'
                },
                {
                    id: 4,
                    title: 'Generative AI',
                    slug: 'generative-ai',
                    description: 'ChatGPT, LLMs, prompt engineering, and creative AI tools.',
                    price: 399,
                    modules: [
                        { id: 1, title: 'Introduction to LLMs', lessons: 8 },
                        { id: 2, title: 'Prompt Engineering', lessons: 11 },
                        { id: 3, title: 'Fine-tuning Models', lessons: 9 },
                        { id: 4, title: 'Building Applications', lessons: 10 }
                    ],
                    rating: 4.9,
                    students: 35680,
                    duration: '50 hours',
                    instructor: 'Dr. Emily Rodriguez',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23ff6b9d" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">✨</text></svg>'
                },
                {
                    id: 5,
                    title: 'AI Tools',
                    slug: 'ai-tools',
                    description: 'No-coding AI tools for students, creators, designers, and businesses.',
                    price: 199,
                    modules: [
                        { id: 1, title: 'ChatGPT & GPT-4', lessons: 6 },
                        { id: 2, title: 'Image Generation Tools', lessons: 8 },
                        { id: 3, title: 'Productivity Tools', lessons: 7 }
                    ],
                    rating: 4.8,
                    students: 42100,
                    duration: '30 hours',
                    instructor: 'Alex Morrison',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23ffa500" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">🛠️</text></svg>'
                },
                {
                    id: 6,
                    title: 'AI Projects',
                    slug: 'ai-projects',
                    description: 'Build chatbots, classifiers, and other AI projects hands-on.',
                    price: 349,
                    modules: [
                        { id: 1, title: 'Building Chatbots', lessons: 10 },
                        { id: 2, title: 'Text Classification', lessons: 9 },
                        { id: 3, title: 'Computer Vision Projects', lessons: 11 }
                    ],
                    rating: 4.8,
                    students: 18920,
                    duration: '55 hours',
                    instructor: 'Dev Kumar',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%2300ced1" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">🚀</text></svg>'
                },
                {
                    id: 7,
                    title: 'AI in Real World',
                    slug: 'ai-real-world',
                    description: 'AI applications in healthcare, finance, education, gaming, and more.',
                    price: 299,
                    modules: [
                        { id: 1, title: 'AI in Healthcare', lessons: 8 },
                        { id: 2, title: 'AI in Finance', lessons: 7 },
                        { id: 3, title: 'AI in Education & Gaming', lessons: 8 }
                    ],
                    rating: 4.7,
                    students: 16540,
                    duration: '45 hours',
                    instructor: 'Dr. Victoria Park',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%2320b2aa" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">🌍</text></svg>'
                },
                {
                    id: 8,
                    title: 'Ethics & Future of AI',
                    slug: 'ethics-future-ai',
                    description: 'AI risks, ethics, job impacts, and how to stay relevant.',
                    price: 199,
                    modules: [
                        { id: 1, title: 'AI Ethics Fundamentals', lessons: 7 },
                        { id: 2, title: 'AI Risks & Safety', lessons: 8 },
                        { id: 3, title: 'Future of Work & Society', lessons: 6 }
                    ],
                    rating: 4.6,
                    students: 22340,
                    duration: '35 hours',
                    instructor: 'Prof. Dr. Nathan Hall',
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23daa520" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" fill="white" font-family="Arial" dy=".3em">⚖️</text></svg>'
                }
            ];
            this.saveCourses();
        }
    }

    // Authentication
    signup(email, password, fullName) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Invalid email format' };
        }
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }
        
        if (this.db.users.some(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now(),
            email,
            password: this.hashPassword(password),
            fullName,
            createdAt: new Date().toISOString(),
            role: 'student'
        };

        this.db.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'Signup successful! Please login.' };
    }

    login(email, password) {
        // Accept any credentials - no validation
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: email || 'user@ailearnhub.local',
            fullName: email ? email.split('@')[0] : 'User',
            role: email && email.toLowerCase().includes('admin') ? 'admin' : 'student',
            createdAt: new Date().toISOString()
        };

        this.currentUser = user;
        sessionStorage.setItem('ailearn_currentUser', JSON.stringify(this.currentUser));
        return { success: true, message: 'Login successful!', user: this.currentUser };
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('ailearn_currentUser');
        return { success: true, message: 'Logged out successfully' };
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Courses
    getCourses() {
        return this.db.courses;
    }

    getCourseBySlug(slug) {
        return this.db.courses.find(c => c.slug === slug);
    }

    getCourseById(id) {
        return this.db.courses.find(c => c.id === id);
    }

    // Enrollments
    enrollCourse(courseId) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'Please login to enroll' };
        }

        const enrollment = {
            id: Date.now(),
            userId: this.currentUser.id,
            courseId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completed: false
        };

        this.db.enrollments.push(enrollment);
        this.saveEnrollments();
        return { success: true, message: 'Successfully enrolled in course!' };
    }

    getEnrollments() {
        if (!this.isAuthenticated()) return [];
        return this.db.enrollments.filter(e => e.userId === this.currentUser.id);
    }

    getAllEnrollments() {
        return this.db.enrollments;
    }

    getEnrollment(userId, courseId) {
        return this.db.enrollments.find(e => 
            e.userId === userId && e.courseId === courseId
        );
    }

    isEnrolled(courseId) {
        if (!this.isAuthenticated()) return false;
        return this.db.enrollments.some(e => 
            e.userId === this.currentUser.id && e.courseId === courseId
        );
    }

    // Purchases
    purchaseCourse(userIdOrCourseId, courseId = null) {
        // Support both old (courseId) and new (userId, courseId) calling conventions
        let userId;
        let targetCourseId;

        if (courseId === null) {
            // Old convention: purchaseCourse(courseId)
            if (!this.isAuthenticated()) {
                return { success: false, message: 'Please login to purchase' };
            }
            userId = this.currentUser.id;
            targetCourseId = userIdOrCourseId;
        } else {
            // New convention: purchaseCourse(userId, courseId)
            userId = userIdOrCourseId;
            targetCourseId = courseId;
        }

        const course = this.getCourseById(targetCourseId);
        if (!course) {
            return { success: false, message: 'Course not found' };
        }

        const purchase = {
            id: Date.now(),
            userId: userId,
            courseId: targetCourseId,
            amount: course.price,
            purchasedAt: new Date().toISOString(),
            status: 'completed'
        };

        this.db.purchases.push(purchase);
        this.savePurchases();

        // Auto-enroll after purchase
        const enrollment = {
            id: Date.now(),
            userId: userId,
            courseId: targetCourseId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completed: false
        };
        this.db.enrollments.push(enrollment);
        this.saveEnrollments();

        return { success: true, message: 'Course purchased successfully!', purchase };
    }

    getPurchases() {
        if (!this.isAuthenticated()) return [];
        return this.db.purchases.filter(p => p.userId === this.currentUser.id);
    }

    getAllPurchases() {
        return this.db.purchases;
    }

    getAllUsers() {
        return this.db.users;
    }

    // Progress tracking
    updateCourseProgress(userIdOrCourseId, progressOrCourseId, progress = null) {
        // Support both conventions: updateCourseProgress(courseId, progress) or updateCourseProgress(userId, courseId, progress)
        let userId;
        let courseId;
        let newProgress;

        if (progress === null) {
            // Old convention: updateCourseProgress(courseId, progress)
            if (!this.isAuthenticated()) return false;
            userId = this.currentUser.id;
            courseId = userIdOrCourseId;
            newProgress = progressOrCourseId;
        } else {
            // New convention: updateCourseProgress(userId, courseId, progress)
            userId = userIdOrCourseId;
            courseId = progressOrCourseId;
            newProgress = progress;
        }
        
        const enrollment = this.db.enrollments.find(e => 
            e.userId === userId && e.courseId === courseId
        );

        if (enrollment) {
            enrollment.progress = Math.min(100, Math.max(0, newProgress));
            enrollment.lastUpdated = new Date().toISOString();
            if (enrollment.progress === 100) {
                enrollment.completed = true;
                enrollment.completedAt = new Date().toISOString();
            }
            this.saveEnrollments();
            return true;
        }
        return false;
    }

    // User profile
    updateProfile(updates) {
        if (!this.isAuthenticated()) return false;

        const user = this.db.users.find(u => u.id === this.currentUser.id);
        if (user) {
            Object.assign(user, updates);
            this.saveUsers();
            
            // Update session user
            Object.assign(this.currentUser, updates);
            sessionStorage.setItem('ailearn_currentUser', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    // Admin functions
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    createAdminUser() {
        const adminUser = {
            id: 'admin',
            email: 'admin@ailearnhub.com',
            password: this.hashPassword('admin123'),
            fullName: 'Admin',
            createdAt: new Date().toISOString(),
            role: 'admin'
        };

        if (!this.db.users.find(u => u.role === 'admin')) {
            this.db.users.push(adminUser);
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Storage methods
    hashPassword(password) {
        // Simple hash for demo (in production, use proper hashing)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    saveUsers() {
        localStorage.setItem('ailearn_users', JSON.stringify(this.db.users));
    }

    saveCourses() {
        localStorage.setItem('ailearn_courses', JSON.stringify(this.db.courses));
    }

    saveEnrollments() {
        localStorage.setItem('ailearn_enrollments', JSON.stringify(this.db.enrollments));
    }

    savePurchases() {
        localStorage.setItem('ailearn_purchases', JSON.stringify(this.db.purchases));
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    getDashboardStats() {
        if (!this.isAuthenticated()) return null;

        const enrollments = this.getEnrollments();
        const purchases = this.getPurchases();

        return {
            enrolledCourses: enrollments.length,
            completedCourses: enrollments.filter(e => e.completed).length,
            totalSpent: purchases.reduce((sum, p) => sum + p.amount, 0),
            averageProgress: enrollments.length > 0 
                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                : 0
        };
    }

    // Clear all data (for testing)
    clearAllData() {
        localStorage.clear();
        sessionStorage.clear();
        this.db = {
            users: [],
            courses: [],
            enrollments: [],
            purchases: [],
            userData: null
        };
        this.currentUser = null;
        this.initializeSampleData();
    }
}

// Global instance
const app = new AILearnHub();

// Create default admin account
app.createAdminUser();
