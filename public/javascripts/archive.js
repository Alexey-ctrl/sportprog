$(function () {
    $.get('/api/get-contests-archive', function (data) {
        const divContests = $('#contests')
        data.forEach(contest => {
            divContests.append(contestDiv(contest));
        });
    });
});

function contestDiv(contest) {
    let contestHtml = `<div className="contest">
                           <h2>${contest.name}</h2>
                           <p>${marked.parse(contest.info)}</p>
                           <h4><a href="/contests/${contest.article}/organizer">Организаторы и спонсоры</a></h4>
                           <h4><a href="/contests/${contest.article}/rules">Правила соревнованийры</a></h4>
                           <h4><a href="/contests/${contest.article}/timetable">Расписание</a></h4>
                           <h4><a href="/contests/${contest.article}/results">Результат</a></h4>
                           <h4><a href="/contests/${contest.article}/materials">Материалы соревнования</a></h4>`;
    contestHtml += '<hr></div>';
    return contestHtml;
}
