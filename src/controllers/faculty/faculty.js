import { getFacultyById, getFacultyBySlug, getSortedFaculty }from '../../models/faculty/faculty.js';


// Route handler for the faculty list page
const facultyListPage = async (req, res) => {
    const sort = req.query.sort;    
    const faculty = await getSortedFaculty(sort);

    res.render('faculty/list', {
        title: 'faculty list',
        faculty: faculty,
        currentSort: sort
    });
};

// Route Handler for faculty detailed page
const facultyDetailPage = async (req, res, next) => {
    const facultyId = req.params.facultyId;
    const facultyMember = await getFacultyBySlug(facultyId);
    
    // if faculty does not exist, a 404 page not found
    if (Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: `${facultyMember.name} - ${facultyMember.title}`,
        faculty: facultyMember
    });
}

export {facultyListPage, facultyDetailPage};

