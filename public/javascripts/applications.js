$(function () {
    $.get('/api/get-contests', function (data) {
        const divContests = $('#contests')
        data.forEach(contest => {
            divContests.append(`<p><a href="/application/view/${contest.article}">${contest.name}</a></p>`);
        });
    });

    /*$('#register').click(function () {
        $.post('/api/auth/register', {
            login: $('#login').val(),
            password: $('#password').val()
        }, function (data) {

        });
    });*/
});