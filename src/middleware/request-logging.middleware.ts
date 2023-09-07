import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: any, res: any, next: (err?: Error) => void) {
        const stream = {
            write: (message: string) => this.logger.log(message.trim()),
        };

        morgan('[INCOMING] :remote-addr :url :method HTTP/:http-version :user-agent', { immediate: true, stream })(
            req,
            res,
            (err) => {
                if (err) {
                    return next(err);
                }

                morgan(
                    '[COMPLETE] :remote-addr - :remote-user [:date] “:method :url HTTP/:http-version” :status :res[content-length] “:referrer” “:user-agent”',
                    { stream },
                )(req, res, next);
            },
        );
    }
}
