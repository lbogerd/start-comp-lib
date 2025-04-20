import { registerGlobalMiddleware } from '@tanstack/react-start'
import { logMiddleware } from './logic/server/loggingMiddleware'

registerGlobalMiddleware({
  middleware: [logMiddleware],
})
