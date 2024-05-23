import { UserDocument } from '../../models/User';
import { HostDocument } from '../../models/Host';
import { ApiKeyDocument } from '../../models/ApiKey';

declare global {
  namespace Express {
    interface User extends UserDocument {}
    interface Host extends HostDocument {}
    interface ApiKey extends ApiKeyDocument {}
  }
}
