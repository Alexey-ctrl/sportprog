$(function () {
    $.get('/api/get-contests', function (data) {
        const divContests = $('#contests')
        data.forEach(contest => {
            divContests.append(contestLink(contest));
        });
    });

    $('#contests').on('click', '.delete-contest', function () {
        const button = $(this);
        alertify.confirm('Подтверждение', `Вы действительно хотите удалить ${button.data('name')}`,
            function () {
                $.ajax({
                    url: '/api/delete-contest',
                    type: 'DELETE',
                    data: {
                        id: button.data('id')
                    },
                    success: function (result) {
                        if (result === 'success') {
                            alertify.success('Удалено успешно');
                            button.parent().remove();
                        }
                        if (result === 'error') {
                            alertify.error('При удалении произошла ошибка');
                        }
                    }
                });
            }, function () {
            });
    });

    $('#create-contest').on('click', '#create-btn', function () {
        alertify.prompt('Создать новое соревнование', 'Название', '',
            function (evt, value) {
                if (!value) {
                    alertify.error('Заполните название соревнования');
                    return;
                }

                $.post('/api/create-contest', {name: value}, function (result) {
                    if (result.message === 'success') {
                        $('#contests').prepend(contestLink(result.contest));
                        alertify.success('Соревнование создано');
                        return;
                    }
                    alertify.error(`Не удалось создать соревнование '${value}'`);
                });
            },
            function () {
            });
    });
});

function contestLink(contest) {
    return `<p>
                <a href="/contests/edit/${contest.article}">${contest.name}</a>
                <button class="delete-contest" data-id="${contest.id}" data-name="${contest.name}">Удалить</button>
            </p>`;
}