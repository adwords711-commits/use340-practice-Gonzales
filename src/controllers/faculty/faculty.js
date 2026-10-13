import { getFacultyById, getSortedFaculty }from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyListPage = (req, res) => {
    const sort = req.query.sort;    
    const faculty = getSortedFaculty(sort);

    res.render('faculty/list', {
        title: 'faculty list',
        faculty: faculty,
        currentSort: sort
    });
};

// Route Handler for faculty detailed page
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId);
    
    // if faculty does not exist, a 404 page not found
    if (!faculty) {
        const err = new Error(`Faculty ${facultyId} not found`);
        err.status = 404;
        next(err);
    }

    res.render('faculty/detail', {
        title: `${faculty.id} - ${faculty.title}`,
        faculty: faculty
    });
}

export {facultyListPage, facultyDetailPage};
