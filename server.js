/**
 * Import Libraries
 */
// Import express using ESM syntax
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { emitWarning } from 'process';

// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};


/**
 * DECLARE IMPORTANT VARIABLES
 */
// Define the port number the server will listen on
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;
const name = process.env.NAME; // <-- NEW
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * SETUP EXPRESS SERVER
 */
// Create an instance of an Express application
const app = express();

/**
 * GLOBAL TIMESTAMP MIDDLEWARE
 * stores the current timestamp in res.locals for each request.
 */

app.use((req, res, next) => {
    res.locals.timestamp = new Date().toISOString();
    next();
});

/** GLOBAL REQUEST LOGGING MIDDLEWARE */

app.use((req, res, next) => {
    // Skip logging for routes that start with /. (like /.well-known/)
    if (!req.path.startsWith('/.')) {
    }
    next(); // Pass control to the next middleware or route
});

/**
 * CONFUGURE EXPRESS MIDDEWARE
 */
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * GLOBAL TEMPLATE VARIABLES MIDDLEWARE
 * 
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to the next middleware or route handler
    next();
});

// Route-specific middleware function
const addVisitCount = (req, res, next) => {
    res.locals.visitCount = 42;
    next();
};

// Middleware to add global data to all templates
app.use((req, res, next) => {
    // Add current year for copyright
    res.locals.currentYear = new Date().getFullYear();

    next();
});

// Global middleware for time-based greeting
app.use((req, res, next) => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 8 && currentMonth <= 10) {
        res.locals.seasonalGreeting = 'Happy Fall';
    } else {
        res.locals.seasonalGreeting = 'Hello!';
    }
    const currentHour = new Date().getHours();

    /**
     * Create logic to set different greetings based on the current hour.
     * Use res.locals.greeting to store the greeting message.
     * Hint: morning (before 12), afternoon (12-17), evening (after 17)
     */
    if (currentHour < 12) {
        res.locals.greeting = '<p>Good morning!</p>';
    } else if (currentHour < 17) {
        res.locals.greeting = '<p>Good afternoon!</p>';
    } else {
        res.locals.greeting = '<p>Good evening!</p>'
    }    
    next();
});

// Global middleware for random theme selection
app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme', 'purple-theme', 'orange-theme'];

    // Your task: Pick a random theme from the array
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    next();
});

// Global middleware to share query parameters with templates
app.use((req, res, next) => {
    // Make req.query available to all templates for debugging and conditional rendering
    res.locals.queryParams = req.query || {};

    next();
});

// Route-specific middleware that sets custom headers
const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'Here is my demo page');

    next();
};
/**
 * ROUTES
 */
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});

app.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});

app.get('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});

app.get('/student', (req, res) => {
    const title = 'Student';

    res.render('student', { 
        title,
        name: 'Jorge Gonzales',
        id: 593540992,
        email: 'gon17014@byui.edu',
        address: '711 Crums Church Rd, Berryville, VA, 22611'
    });
});

// Course catalog list page
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});

app.get('/welcome', addVisitCount, (req, res) => {
    res.send(`The current timestamp is ${res.locals.timestamp}<br> The current visit count is  ${res.locals.visitCount}`);
});

let demoRequestCount = 0

// Demo page route with header middleware
app.get('/demo', addDemoHeaders, (req, res) => {
    demoRequestCount++;
    res.render('demo', {
        title: 'Middleware Demo Page',
        demoRequestCount: demoRequestCount
    });
});

/** DYNAMIC ROUTE WITH PARAMETERS AND QUERY HANDLING */

// Enhanced course detail route with sorting
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'time';

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    // Sort based on the parameter
    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});

/** ERROR-HANDLING TEST ROUTES */

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Test forbidden for 403 erros
app.get('/test-403', (req, res, next) => {
    const err = new Error('The access is forbidden');
    err.status = 403;
    next(err);
});

// Test bad request for 400 erros
app.get('/test-bad-request', (req, res, next) => {
    const err = new Error('This is a bad request test error');
    err.status = 400;
    next(err);

});

// CARCH-ALL ROUTE FOR 404 ERRORS
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    // Prevent infinite loops, if a response has already been sent, do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // Our WebSocket check needs this and its convenient to pass along
    };

    // Render the appropriate error template with fallback
    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});

//** DEVELOPMENT WEBSOCKET SERVER */

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

/** START SERVER */

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});