import type { Session } from 'express-session'

export type UserSessionData = {
  id: string
  email: string
}

export type UserSession = Session & Record<'user', UserSessionData>
