const statusView = {
    1: [],
    2: ['contest-info', 'contest-org', 'contest-sponsor', 'contest-roles', 'contest-time'],
    3: ['contest-info', 'contest-org', 'contest-sponsor', 'contest-roles', 'contest-time'],
    4: ['contest-info', 'contest-org', 'contest-sponsor', 'contest-roles', 'contest-time'],
    5: ['contest-info', 'contest-org', 'contest-sponsor', 'contest-roles', 'contest-time', 'contest-result'],
    6: ['contest-info', 'contest-org', 'contest-sponsor', 'contest-roles', 'contest-time', 'contest-result'],
    7: ['contest-info', 'contest-org', 'contest-sponsor', 'contest-roles', 'contest-time', 'contest-result', 'contest-material'],
    8: []
}

$(function () {
    const title = $('#contest-name');
    let contestId;

    $.get(`/api/get-contests/${title.html()}`, function (data) {
        contestId = data.id;
        title.html(`${data.name} (${data.article})`);

        $('#contest-status-select').val(data.status_id);
        $('#file-input').attr('data-article', data.article);
        data.files.forEach(file => {
            $('#files-view').append(fileLink(file));
        });

        $('#info-text').html(data.info);
        $('#org-text').html(data.organizer);
        $('#sponsor-text').html(data.sponsor);
        $('#roles-text').html(data.rules);
        $('#time-text').html(data.timetable);
        $('#result-text').html(data.results);
        $('#material-text').html(data.materials);

        $('#info-preview').html(marked.parse(data.info));
        $('#org-preview').html(marked.parse(data.organizer));
        $('#sponsor-preview').html(marked.parse(data.sponsor));
        $('#roles-preview').html(marked.parse(data.rules));
        $('#time-preview').html(marked.parse(data.timetable));
        $('#result-preview').html(marked.parse(data.results));
        $('#material-preview').html(marked.parse(data.materials));
        viewInfoBlocks(data.status_id);
    });

    $('.save-btn').click(function () {
        const text = $(this).parent().parent().find('textarea').val();
        const table = $(this).data('table');
        $.ajax({
            url: '/api/update-info',
            type: 'PUT',
            data: {
                id: contestId,
                info: text,
                table: table
            },
            success: function (result) {
                if (result === 'success') {
                    alertify.success('Информация изменена');
                }
                if (result === 'error') {
                    alertify.error('При сохранении произошла ошибка');
                }
            }
        });
    });

    $('#contest-status-select').change(function () {
        const statusId = $(this).val();
        $.ajax({
            url: '/api/update-status',
            type: 'PUT',
            data: {
                id: contestId,
                status: statusId
            },
            success: function (result) {
                if (result === 'success') {
                    alertify.success('Статус изменем');
                    viewInfoBlocks(statusId);
                }
                if (result === 'error') {
                    alertify.error('Не возномно установить статус');
                }
            }
        });
    });

    $('.contest-text').on('input', function () {
        $(this).parent().find('div').html(marked.parse($(this).val()));
    });

    $('#file-loader').change(function () {
        const file = $("#file-input").prop('files')[0];
        const fd = new FormData;

        fd.append($("#file-input").data('article'), file);

        $.ajax({
            url: '/api/upload-file',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                if (data.message === 'success') {
                    $('#files-view').append(fileLink(data.file));
                    alertify.success('Файл загружен');
                }
            }
        });
    });

    $('#files-view').on('click', '.delete-file-btn', function () {
        const btn = $(this);
        alertify.confirm('Подтверждение', 'Вы действительно хотите удалить файл',
            function () {
                $.ajax({
                    url: '/api/delete-file',
                    type: 'DELETE',
                    data: {
                        id: btn.data('id'),
                        path: btn.data('path')
                    },
                    success: function (result) {
                        if (result === 'success') {
                            alertify.success('Удалено успешно');
                            btn.parent().remove();
                        }
                        if (result === 'error') {
                            alertify.error('При удалении произошла ошибка');
                        }
                    }
                });
            }, function () {
            });
    });
});

function fileLink(file) {
    const filePath = `/contests/${file.contest_article}/${file.file}`;
    return `<p>
                <a href="${filePath}" target="_blank">${file.file}</a>
                <button class="delete-file-btn" data-id="${file.id}" data-path="${filePath}">Удалить</button>
            </p>`;
}

function viewInfoBlocks(status) {
    const view_status = statusView[status];
    $('.info-block').addClass('info-view');
    $('.info-block').removeClass('info-view-active');
    if (view_status.length === 0) {
        $('.info-block').removeClass('info-view');
        $('.info-block').addClass('info-view-active');
        return;
    }
    view_status.forEach(info => {
        $('#' + info).removeClass('info-view');
        $('#' + info).addClass('info-view-active');
    });
}