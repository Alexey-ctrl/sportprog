$(function () {
    $.get('/api/get-contests-active', function (data) {
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
                           <h4><a href="/contests/${contest.article}/timetable">Расписание</a></h4>`;
    if (contest.status.id === 3) {
        contestHtml += `<h3><a href="/application/new/${contest.article}">Регистрация</a></h3>`;
    }
    if (contest.status.id === 4 || contest.status.id === 7) {
        contestHtml += `<h3><a href="/contests/${contest.article}/results">Результат</a></h3>`;
    }
    if (contest.status.id === 7) {
        contestHtml += `<h3><a href="/contests/${contest.article}/materials">Материалы соревнования</a></h3>`;
    }
    contestHtml += '<hr></div>';
    return contestHtml;
}
