const mailTransporter = require('./mail-transporter');

function sendEmailNotification(adus, usersEmails, currentUser, contractId, originURL) {
    let recipientsEmails = [];
    for (const adu of adus) {
        recipientsEmails.push(adu.email);
    }
    if (usersEmails.length > 0) {
        for (const ue of usersEmails) {
            recipientsEmails.push(ue);
        }
    }

    let mailOptions = {
        to: recipientsEmails,
        from: "prishtinaopencontracts@noreply.com",
        subject: `Kontratat e Hapura - Prishtinë - Koment i ri u shtua nga ${currentUser} në një kontratë`,
        text: 'I/e nderuar,\n\n' +
                'Ju informojmë se është shtuar një koment i ri.\n\n' +
                'Për më shumë info rreth komentit klikoni në linkun e mëposhtëm: \n\n' +
                'Linku i kontratës: ' + originURL + '/dashboard/contracts/' + contractId + '\n\n' +
                'Me nderime,\n'
    }

    return mailTransporter.sendMail(mailOptions);
    
}

module.exports = sendEmailNotification;