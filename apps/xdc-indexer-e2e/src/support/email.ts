import MailSlurp from 'mailslurp-client';

const mailslurp = new MailSlurp({
  apiKey: Cypress.env('MAILSLURP_API_KEY'),
});

export const saveAttachment = () => {
  return cy.fixture('../fixtures/motherload.pdf', 'base64');
};

export const uploadAttachment = (base64File: string, newGuid: string) => {
  return mailslurp.uploadAttachment({
    base64Contents: base64File,
    contentType: 'application/pdf',
    filename: `motherload-${newGuid}.pdf`,
  });
};

export const createInbox = () => {
  return cy.mailslurp().then(mailslurp => mailslurp.createInbox());
};

export const sendEmail = (toEmailAddress: string, inboxId: string, attachmentId: string) => {
  return mailslurp
    .sendEmail(inboxId, {
      to: [toEmailAddress],
      subject: 'Test Email',
      attachments: [attachmentId],
    })
    .then(sentEmail => {
      expect(sentEmail.subject).to.equal('Test Email');
    });
};
