import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSuccessMessage(): string {
    return 'Success';
  }
}
