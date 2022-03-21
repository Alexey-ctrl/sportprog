$(function () {
    $.get('/api/applications/' + contest, function (result) {
        const applicationDiv = $('#applications');
        result.forEach(application => {
            applicationDiv.append(applicationHtml(application));
        });
    });

    $('#applications').on('click', '.accept', function () {
        const el = $(this);
        $.ajax({
            url: "/api/application/status",
            type: 'PUT',
            data: {
                id: el.parent().data('id'),
                status: 1
            },
            success: function () {
                el.parent().replaceWith('<p style="color: green">Принято</p>');
            }
        });
    });

    $('#applications').on('click', '.reject', function () {
        const el = $(this);
        alertify.prompt('Сообщение', 'Отправить письмо', 'Ваша заявка отклонена.'
            , function (evt, value) {
                $.ajax({
                    url: "/api/application/status",
                    type: 'PUT',
                    data: {
                        id: el.parent().data('id'),
                        status: 2,
                        message: value
                    },
                    success: function () {
                        el.parent().replaceWith('<p style="color: red">Отклонено</p>');
                    }
                });
            }
            , function () {
            });
    });
});

function applicationHtml(application) {
    let html = '<p>';
    if (!application.members.length) {
        return;
    }
    if (application.team) {
        html += `<div>Командная (${application.team})</div>`;
        let trainer = '';
        let competitor = '';
        application.members.forEach(member => {
            if (member.is_trainer) {
                trainer += `
                         <p>
                            <div>Тренер:</div>
                            <div>ФИО: ${member.fio}</div>
                            <div>E-mail: ${member.email}</div>
                            <div>Терефон: ${member.phone}</div>
                            <div>Огранизация: ${member.organization}</div>
                         </p>
                         <div>Участники:</div>`;
            } else {
                competitor +=
                    `<p>
                        <div>ФИО: ${member.fio}</div>
                        <div>E-mail: ${member.email}</div>
                        <div>Терефон: ${member.phone}</div>
                    </p>`;
            }
        });
        html += trainer + competitor
    } else {
        html += `<div>Личная:</div>
                 <p>
                    <div>ФИО: ${application.members[0].fio}</div>
                    <div>E-mail: ${application.members[0].email}</div>
                    <div>Терефон: ${application.members[0].phone}</div>
                    <div>Огранизация: ${application.members[0].organization}</div>
                 </p>`;
    }
    if (application.status === 0) {
        html += `<div class="status-block" data-id="${application.id}"><input type="button" class="accept" value="Принять"><button class="reject">Отклонить</button></div>`;
    } else if (application.status === 1) {
        html += '<p style="color: green">Принято</p>';
    } else if (application.status === 2) {
        html += '<p style="color: red">Отклонено</p>';
    }
    html += '<hr></p>';
    return html;
}