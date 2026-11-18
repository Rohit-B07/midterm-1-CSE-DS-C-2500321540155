const http = require('http');
const PORT = 3001;

let courses = [
    {
        id: "101",
        CourseName: "FSD",
        CourseCode: "FSD201",
        department: "CSE"
    },
    {
        id: "102",
        CourseName: "Data Structures",
        CourseCode: "DS202",
        department: "CSE"
    },
    {
        id: "103",
        CourseName: "DBMS",
        CourseCode: "DBMS203",
        department: "CSE"
    }
];

const server = http.createServer((req, res) => {

    console.log(`Request Received: ${req.method} ${req.url}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Node.js');

    if (req.url === '/' && req.method === 'GET') {
        res.end(JSON.stringify({
            message: 'Welcome to Course Management System'
        }));
    }

    else if (req.url === '/courses' && req.method === 'GET') {
        res.end(JSON.stringify(courses));
    }

    else if (req.method === 'GET' && req.url.startsWith('/courses/')) {

        const id = req.url.split('/')[2];
        const course = courses.find(c => c.id === id);

        if (course) {
            res.end(JSON.stringify(course));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'Course Not Found' }));
        }
    }

  
    else if (req.url === '/courses' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newCourse = JSON.parse(body);

                if (!newCourse.id || !newCourse.CourseName ||
                    !newCourse.CourseCode || !newCourse.department) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({
                        message: 'All fields are required'
                    }));
                }

                if (courses.some(c => c.id === newCourse.id)) {
                    res.statusCode = 409;
                    return res.end(JSON.stringify({
                        message: 'Course ID already exists'
                    }));
                }

                courses.push(newCourse);

                res.statusCode = 201;
                res.end(JSON.stringify({
                    message: 'Course Added Successfully',
                    course: newCourse
                }));

            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    message: 'Invalid JSON Data'
                }));
            }
        });
    }

    else if (req.method === 'PUT' && req.url.startsWith('/courses/')) {

        const id = req.url.split('/')[2];
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatedData = JSON.parse(body);
                const course = courses.find(c => c.id === id);

                if (!course) {
                    res.statusCode = 404;
                    return res.end(JSON.stringify({
                        message: 'Course Not Found'
                    }));
                }

                if (!updatedData.CourseName || !updatedData.CourseCode ||
                    !updatedData.department) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({
                        message: 'All course fields are required'
                    }));
                }

                course.CourseName = updatedData.CourseName;
                course.CourseCode = updatedData.CourseCode;
                course.department = updatedData.department;

                res.end(JSON.stringify({
                    message: 'Course Updated Successfully',
                    course: course
                }));

            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    message: 'Invalid JSON Data'
                }));
            }
        });
    }

    else if (req.method === 'DELETE' && req.url.startsWith('/courses/')) {

        const id = req.url.split('/')[2];
        const index = courses.findIndex(c => c.id === id);

        if (index !== -1) {

            const deletedCourse = courses.splice(index, 1);

            res.end(JSON.stringify({
                message: 'Course Deleted Successfully',
                course: deletedCourse[0]
            }));

        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({
                message: 'Course Not Found'
            }));
        }
    }


    else {
        res.statusCode = 404;
        res.end(JSON.stringify({
            message: '404 - Route Not Found'
        }));
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});