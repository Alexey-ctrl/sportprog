$(function () {
    $('#form-team').hide();
    $('#type-change').click(function () {
        const button = $(this);
        $('#form-' + button.data('type')).hide();
        if (button.data('type') === 'personal') {
            button.data('type', 'team');
            button.html('Личная');
        } else {
            button.data('type', 'personal');
            button.html('Командная');
        }
        $('#form-' + button.data('type')).show();
    });

    $('#send-form').click(function () {
        $.post('/api/personal-form', {
            fio: $('#fio-input').val(),
            phone: $('#phone-input').val(),
            email: $('#email-input').val(),
            organization: $('#organization-input').val(),
            article: contest
        }, result => {
            if (result === 'ok') {
                window.location.href = "/thanks";
            }
            alertify.error('Произошла ошибка');
        });
    });
    $('#send-form-team').click(function () {
        const members = [];
        $('.member').each(function () {
            const member = $(this);
            const memberData = {
                fio: member.find('#fio-input-team').val(),
                phone: member.find('#phone-input-team').val(),
                email: member.find('#email-input-team').val()
            };
            if (member.attr('id') === 'trainer') {
                memberData.is_trainer = true;
                memberData.organization = member.find('#organization-input-team').val();
            }
            members.push(memberData);
        });

        $.ajax
        ({
            type: "POST",
            url: '/api/team-form',
            contentType: 'application/json',
            data: JSON.stringify({
                members: members,
                article: contest,
                team: $('#team-input').val()
            }),
            success: function (result) {
                if (result === 'ok') {
                    window.location.href = "/thanks";
                }
                alertify.error('Произошла ошибка');
            }
        })
    });

    let memberCount = 0
    $('#add-button').click(function () {
        memberCount += 1;
        $('#members').append(memberHtml(memberCount));
    });

    $('#members').on('click', ' .delete-member', function () {
        console.log('here');
        $(this).parent().remove();
    })
});

function memberHtml(count) {
    return `<div class="member" id="member-${count}">
    <hr>
    <p>Участник ${count}</p>
    <div>
        <lable for="fio-input-team">ФИО</lable>
        <input type="text" name="fio" id="fio-input-team">
    </div>
    <div>
        <lable for="phone-input-team">Телефон</lable>
        <input type="text" name="phone" id="phone-input-team">
    </div>
    <div>
        <lable for="email-input-team">E-mail</lable>
        <input type="email" name="email" id="email-input-team">
    </div>
    <input type="button" class="delete-member" value="Убрать участника">
    </div>`;
}