enum UserType {
  MANIFESTO,
  CONTRACTOR,
  RINGER
}

export interface Match {
  id: string;
  time: string;
  reminderTime: string;
  remindersSent: string[];
  players: Player[];
  playersOut: Player[];
}

export interface Player {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  userType: UserType;
  reminders: boolean;
  matchesPlayed: Match[];
  matchesOptedOut: Match[];
  payments: Payment[];
  slackId: string;
}

export interface Payment {
  time: string;
  amountPaid: number;
}

export interface AdminOptions {
  id: string;
  koTime: string;
  maxPlayers: number;
  reminderTime: string;
  reminderDay: number;
}
