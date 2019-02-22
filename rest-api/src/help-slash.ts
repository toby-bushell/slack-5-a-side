export class HelpSlash {
  response(errorMessage: string = null) {
    const message: string =
      errorMessage || ':wave: Need some help with `/footie`?';
    return {
      text: message,
      attachments: [
        {
          text:
            '• `/footie in` to opt in to the upcoming game \n• `/footie out` to opt out of the upcoming game  \n• `/footie info` to get some info about the next game! \n• `/footie balance` to get your current balance',
          mrkdwn_in: ['text']
        }
      ]
    };
  }
}
