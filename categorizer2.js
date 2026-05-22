const fs = require('fs');

const inputHtml = fs.readFileSync('learning-archive.html', 'utf8');

// The main table extraction: wait, there are multiple tables now.
// Let's just extract ALL course rows from the document!
const rowRegex = /<tr class="course-row[^>]*>[\s\S]*?<\/tr>/gi;
const rows = [...inputHtml.matchAll(rowRegex)].map(m => m[0]);

const categories = {
    'tag-it': { title: 'IT & Computer Science', rows: [] },
    'tag-math': { title: 'Mathematics', rows: [] },
    'tag-hum': { title: 'Humanities', rows: [] },
    'tag-soc': { title: 'Social Science', rows: [] },
    'tag-eng': { title: 'English & Communication', rows: [] },
    'tag-sci': { title: 'Natural Science', rows: [] },
    'tag-gen': { title: 'General & Transfer', rows: [] }
};

const mapCodeToTag = {
    'CS ': 'tag-it',
    'ITN ': 'tag-it',
    'ITE ': 'tag-it',
    'ITP ': 'tag-it',
    'MATH ': 'tag-math',
    'MTH ': 'tag-math',
    'HIEU ': 'tag-hum',
    'HIS ': 'tag-hum',
    'ENWR ': 'tag-eng',
    'ENSP ': 'tag-eng',
    'ENG ': 'tag-eng',
    'CST ': 'tag-eng',
    'PHYS ': 'tag-sci',
    'PSYC ': 'tag-soc',
    'PSY ': 'tag-soc',
    'COMM ': 'tag-gen',
    'BUS ': 'tag-gen',
    'SDV ': 'tag-gen'
};

const tagToName = {
    'tag-it': 'IT &amp; CS',
    'tag-math': 'Math',
    'tag-hum': 'Humanities',
    'tag-soc': 'Social Science',
    'tag-eng': 'English &amp; Comm',
    'tag-sci': 'Science',
    'tag-gen': 'General'
};

const correctedRows = rows.map(row => {
    // Determine the subject code
    const tdMatch = row.match(/<td>([A-Z]+ \d+[A-Z]?)<\/td>/);
    let courseCode = tdMatch ? tdMatch[1] : '';

    if (!row.includes('<span class="course-tag')) {
        let matchedTag = 'tag-gen'; // Default
        for (const [prefix, tag] of Object.entries(mapCodeToTag)) {
            if (courseCode.startsWith(prefix)) {
                matchedTag = tag;
                break;
            }
        }
        
        // Inject tag after the title
        row = row.replace(/(<td>.*?)(<\/td>)/g, (match, p1, p2, offset, string) => {
            // Find the 2nd td (Title)
            if (offset === string.indexOf('<td>', string.indexOf('<td>') + 1)) {
                return `${p1} <span class="course-tag ${matchedTag}">${tagToName[matchedTag]}</span>${p2}`;
            }
            return match;
        });
    }
    return row;
});

let uncategorized = [];
correctedRows.forEach(row => {
    let matched = false;
    for (const [tagClass, catData] of Object.entries(categories)) {
        if (row.includes(tagClass)) {
            catData.rows.push(row);
            matched = true;
            break;
        }
    }
    if (!matched) {
        uncategorized.push(row);
    }
});

function extractLevel(row) {
    const tdMatch = row.match(/<td>([A-Z]+)\s*(\d{3,4})[A-Z]?<\/td>/);
    if (tdMatch) {
        return parseInt(tdMatch[2], 10);
    }
    return 9999;
}

let newHtmlContent = '\n<div id="courses" class="content-section">\n';

for (const [tagClass, catData] of Object.entries(categories)) {
    if (catData.rows.length === 0) continue;
    catData.rows.sort((a, b) => extractLevel(a) - extractLevel(b));
    newHtmlContent += `
        <div class="category-section">
            <h3 class="category-heading">${catData.title}</h3>
            <table class="learning-table course-table category-table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Title</th>
                        <th>Origin</th>
                        <th>Term</th>
                        <th>Grade</th>
                        <th>Transfer</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
${catData.rows.join('\n')}
                </tbody>
            </table>
        </div>
`;
}

if (uncategorized.length > 0) {
    newHtmlContent += `
        <div class="category-section">
            <h3 class="category-heading">Other Courses</h3>
            <table class="learning-table course-table category-table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Title</th>
                        <th>Origin</th>
                        <th>Term</th>
                        <th>Grade</th>
                        <th>Transfer</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
${uncategorized.join('\n')}
                </tbody>
            </table>
        </div>
`;
}
newHtmlContent += '</div>\n';

const wholeSectionRegex = /<div id="courses" class="content-section">[\s\S]*?<\/div>(\s*<!-- Statistics Container -->)/i;
const finalHtml = inputHtml.replace(wholeSectionRegex, newHtmlContent + '$1');
fs.writeFileSync('learning-archive.html', finalHtml);
console.log("Categorized exactly " + correctedRows.length + " classes. Uncategorized: " + uncategorized.length);
